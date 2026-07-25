"""Make a fixed-opacity Krita preset from Diane's charcoal pencil preset.

Requires Pillow: python -m pip install Pillow
Usage: python build_fixed_grain.py SOURCE.kpp OUTPUT.kpp
"""

from pathlib import Path
import sys
import xml.etree.ElementTree as ET

from PIL import Image, PngImagePlugin


NAME = "Diane Charcoal Fixed Grain"
PRESSURE_FLAGS = (
    "PressureOpacity",
    "PressureFlow",
    "PressureTexture/Strength/",
    "MaskingBrush/Preset/PressureOpacity",
    "MaskingBrush/Preset/PressureFlow",
)


def main(source: Path, destination: Path) -> None:
    if destination.exists():
        raise FileExistsError(destination)

    with Image.open(source) as image:
        preset = image.info["preset"]
        original_name = ET.fromstring(preset).get("name")
        if not original_name or "Charcoal pencil large" not in original_name:
            raise ValueError("Source is not the expected charcoal pencil preset")

        old_name = f'name="{original_name}"'
        if preset.count(old_name) != 1:
            raise ValueError("Could not uniquely identify the preset name")
        preset = preset.replace(old_name, f'name="{NAME}"', 1)

        for flag in PRESSURE_FLAGS:
            old = f'name="{flag}">true</param>'
            if preset.count(old) != 1:
                raise ValueError(f"Expected one enabled setting: {flag}")
            preset = preset.replace(old, f'name="{flag}">false</param>', 1)

        parameters = {item.get("name"): item.text for item in ET.fromstring(preset).iter("param")}
        if any(parameters[flag] != "false" for flag in PRESSURE_FLAGS):
            raise ValueError("A pressure setting is still enabled")
        if parameters["Texture/Pattern/Enabled"] != "true":
            raise ValueError("The grain pattern is not enabled")
        if parameters["MaskingBrush/Enabled"] != "true":
            raise ValueError("The textured masking brush is not enabled")

        metadata = PngImagePlugin.PngInfo()
        metadata.add_text("preset", preset, zip=True)
        metadata.add_text("version", image.info["version"])
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(destination, format="PNG", pnginfo=metadata, dpi=image.info.get("dpi"))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Usage: python build_fixed_grain.py SOURCE.kpp OUTPUT.kpp")
    main(Path(sys.argv[1]), Path(sys.argv[2]))
