"""Make a fixed-opacity Krita preset from Diane's charcoal pencil preset.

Requires Pillow: python -m pip install Pillow
Usage: python build_fixed_grain.py SOURCE.kpp OUTPUT.kpp
"""

from pathlib import Path
import sys
import xml.etree.ElementTree as ET

from PIL import Image, PngImagePlugin


NAME = "Diane Charcoal Soft Grain Taper"
TEXTURE_SCALE = "0.45"
TEXTURE_STRENGTH = "0.60"
PRESSURE_FLAGS = (
    "PressureOpacity",
    "PressureFlow",
    "PressureTexture/Strength/",
    "MaskingBrush/Preset/PressureOpacity",
    "MaskingBrush/Preset/PressureFlow",
)

SIZE_CURVE = "0,0;0.4,1;1,1;"


def replace_once(preset: str, old: str, new: str, setting: str) -> str:
    if preset.count(old) != 1:
        raise ValueError(f"Expected one setting for {setting}")
    return preset.replace(old, new, 1)


def main(source: Path, destination: Path) -> None:
    if destination.exists():
        raise FileExistsError(destination)

    with Image.open(source) as image:
        preset = image.info["preset"]
        original_name = ET.fromstring(preset).get("name")
        if not original_name or "Charcoal pencil large" not in original_name:
            raise ValueError("Source is not the expected charcoal pencil preset")

        old_name = f'name="{original_name}"'
        preset = replace_once(preset, old_name, f'name="{NAME}"', "preset name")

        for flag in PRESSURE_FLAGS:
            old = f'name="{flag}">true</param>'
            preset = replace_once(preset, old, f'name="{flag}">false</param>', flag)

        preset = replace_once(
            preset,
            'name="Texture/Pattern/Scale">0.35</param>',
            f'name="Texture/Pattern/Scale">{TEXTURE_SCALE}</param>',
            "texture scale",
        )
        preset = replace_once(
            preset,
            'name="Texture/Strength/Value">0.48</param>',
            f'name="Texture/Strength/Value">{TEXTURE_STRENGTH}</param>',
            "texture strength",
        )
        preset = replace_once(
            preset,
            '<curve>0,0.497817;1,1;</curve> </params> ]]></param> <param type="internal" name="SizeUseCurve"',
            f'<curve>{SIZE_CURVE}</curve> </params> ]]></param> <param type="internal" name="SizeUseCurve"',
            "size sensor curve",
        )
        preset = replace_once(
            preset,
            'name="SizecommonCurve"><![CDATA[0,0.497817;1,1;]]></param>',
            f'name="SizecommonCurve"><![CDATA[{SIZE_CURVE}]]></param>',
            "size curve",
        )

        parameters = {item.get("name"): item.text for item in ET.fromstring(preset).iter("param")}
        if any(parameters[flag] != "false" for flag in PRESSURE_FLAGS):
            raise ValueError("A pressure setting is still enabled")
        if parameters["Texture/Pattern/Enabled"] != "true":
            raise ValueError("The grain pattern is not enabled")
        if parameters["MaskingBrush/Enabled"] != "true":
            raise ValueError("The textured masking brush is not enabled")
        if parameters["Texture/Pattern/Scale"] != TEXTURE_SCALE or parameters["Texture/Strength/Value"] != TEXTURE_STRENGTH:
            raise ValueError("The grain settings did not update")
        if SIZE_CURVE not in parameters["SizeSensor"] or parameters["SizecommonCurve"] != SIZE_CURVE:
            raise ValueError("The taper curve did not update")

        metadata = PngImagePlugin.PngInfo()
        metadata.add_text("preset", preset, zip=True)
        metadata.add_text("version", image.info["version"])
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(destination, format="PNG", pnginfo=metadata, dpi=image.info.get("dpi"))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Usage: python build_fixed_grain.py SOURCE.kpp OUTPUT.kpp")
    main(Path(sys.argv[1]), Path(sys.argv[2]))
