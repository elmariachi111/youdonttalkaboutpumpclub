const range = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const useImages = (folder,ifirst,ilast) => {
  return range(ifirst, ilast).map((i) => {
    const img = new Image();
    img.src = `${folder}/${i}.jpg`;
    return img;
  })
}