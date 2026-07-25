# Diane Charcoal Fixed Grain

`diane-charcoal-soft-grain-taper.kpp` is the current preset. It keeps the embedded charcoal pattern and masking brush, with a 45% pattern scale and 60% fixed texture strength. This softens the speckled edges of the previous `diane-charcoal-grain-taper.kpp` (100% scale, 85% strength). `diane-charcoal-fixed-grain.kpp` is the first fixed-opacity version. Pressure does not control opacity, flow, or texture strength in any of these brushes.

The current preset was built from Diane's latest saved copy with `build_fixed_grain.py`. Size still responds to pressure, with a curve that reaches zero as the pen lifts. A pointed ending requires easing up on the pen at the end of the stroke.

To install it in Krita, use the folder icon in the brush preset chooser (`F6`) and select the `.kpp` file, or copy it into Krita's `paintoppresets` resource directory and restart Krita.
