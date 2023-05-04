# See this project in action 

[https://jocular-manatee-f11db6.netlify.app/](https://jocular-manatee-f11db6.netlify.app/)

# What it is

It's a random avatar (or abstract image) generator. Select a hue and generate a random avatar 
for your profile picture, which may (or may not) look similar to this:

![ranpic image](/src/assets/ranpic.png)

# How it works

This app creates a random kaleidoscope-like image made of triangles and circles on a white
background. The user can select the hue for the shapes.

# The technologies used

It's a simple static Vue app that uses the standard Worker API. 
The worker runs as a separate thread to render the image using OffscreenCanvas API.
