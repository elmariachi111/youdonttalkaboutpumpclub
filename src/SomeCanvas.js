import { useEffect, useRef, useState } from "react";

export default function SomeCanvas(props) {
  const {setStream} = props
  const cref = useRef(null);

  const images = [
    "/img/1.jpg",
    "/img/2.jpg",
    "/img/3.jpg",
    "/img/4.jpg",
    "/img/5.jpg",
    "/img/6.jpg",
    "/img/7.jpg",
    "/img/8.jpg",
    "/img/9.jpg",
    "/img/10.jpg",
  ].map((imgUrl) => {
    const img = new Image();
    img.src = imgUrl;
    return img;
  });

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
    setStream(stream)
    setInterval(nextImage, 500); // Change image every 3 seconds
  }, [cref]);

  return <canvas id="myCanvas" width="640" height="480" ref={cref}></canvas>;
}
