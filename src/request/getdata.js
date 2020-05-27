import server from './request'
import axios from 'axios';

//获取歌曲url
export const getsongUrl = id => {
  return server({
    url: `/song/url?id=${id}`,
  })
}
//获取歌曲详细信息
export const getsongDetail = ids => {
  return server({
    url: `/song/detail?ids=${ids}`,
  })
}
//获取新歌
export const  getsongNew = () => {
  return server({
    url: `/personalized/newsong`,
  })
}

//获取歌曲排行榜
export const getsongTop = idx => {
  return server({
    url: `/top/list?idx=${idx}`,
  })
}
//获取歌词
export const getsongLyric = id => {
  return server({
    url: `/lyric?id=${id}`
  })
}

//获取评论
export const getsongComment = (id, limit, offset = 0) => {
  return server({
    url: `/comment/music?id=${id}&limit=${limit}&offset=${offset}`
  })
}

//获取搜索建议
export const getsearchSuggest = (keywords) => {
  return server({
    url: `/search/suggest?keywords=${keywords}`
  })
}

//并发请求
export const serverAll = (arr) => {
  return axios.all(arr)
}