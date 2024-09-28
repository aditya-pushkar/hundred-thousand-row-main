const htt = {1:{sqr: 1}, 2:{sqr: 4}, 3:{sqr:9}}

console.log(htt[2])
Object.entries(htt).forEach(([key, value]) => {
  console.log(key, value);
});