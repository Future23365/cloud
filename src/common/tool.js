export let timeShow = time => {
  let minute;
  let second;
  if(time >= 60) {
    time = Math.ceil(time);
    minute = (time / 60).toString().split(".")[0];
    minute < 10 ? minute = "0" + minute : minute = minute;
    second= (time - minute * 60).toFixed(0); 
    second < 10 ? second = "0" + second : second = second;
    
  }else {
    minute = "00";
    second = time.toFixed(0);
    second < 10 ? second = "0" + second : second = second;
  }
  return minute + ":" + second;
}