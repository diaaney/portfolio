# Diane Charcoal Fixed Grain

`diane-charcoal-fixed-grain.kpp` is the first fixed-opacity version. `diane-charcoal-grain-taper.kpp` is the updated version to use: it keeps the embedded charcoal pattern and masking brush, enlarges the pattern so grain remains visible at small brush sizes, and increases its fixed strength. Pressure no longer controls opacity, flow, or texture strength in either brush.

The updated preset was built from Diane's latest saved copy with `build_fixed_grain.py`. Its texture strength is 85%. Size still responds to pressure, with a curve that reaches zero as the pen lifts. A pointed ending requires easing up on the pen at the end of the stroke.

To install it in Krita, use the folder icon in the brush preset chooser (`F6`) and select the `.kpp` file, or copy it into Krita's `paintoppresets` resource directory and restart Krita.
