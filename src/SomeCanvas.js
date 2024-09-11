import { useEffect, useRef } from "react";
import { useImages } from "./useImages";

/// displays a canvas with changing content. exposes its captured video stream
export default function SomeCanvas(props) {
  const {setStream, images:  {folder,from,to} } = props
  const cref = useRef(null);

  const images = useImages(folder, from, to);

  useEffect(() => {
    if (!cref) return;
    const canvas = cref.current;
    const ctx = canvas.getContext("2d");
    let currentIndex = 0;

    function nextImage() {
      currentIndex++;
      if (currentIndex >= images.length) {
        currentIndex = 0;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(images[currentIndex], 0, 0, canvas.width, canvas.height);
    }
    const stream = canvas.captureStream();
    console.debug("canvas stream ready", stream)
    setStream(stream)
    const timeout = setInterval(nextImage, 500); // Change image every 3 seconds

    return () => {
      clearInterval(timeout);
    }
  }, [cref]);

  return <canvas id="myCanvas" width="640" height="480" ref={cref}></canvas>;
}
