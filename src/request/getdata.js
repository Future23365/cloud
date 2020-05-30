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
export const getsongNew = () => {
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
export const getsongComment = (id, limit, target, offset = 0) => {
  return server({
    url: `/comment/${target}?id=${id}&limit=${limit}&offset=${offset}`
  })
}

//获取搜索建议
export const getsearchSuggest = (keywords) => {
  return server({
    url: `/search/suggest?keywords=${keywords}`
  })
}
//获取搜索结果
export const getsearchResult = (keywords, limit = 30, offset = 0, type = 1) => {
  return server({
    url: `/search?keywords=${keywords}&limit=${limit}&offset=${offset}&type=${type}`
  })
}

//获取mv数据
export const getMvdata = id => {
  return server({
    url: `/mv/detail?mvid=${id}`
  })
}
//获取mv播放地址
export const getMvurl = id => {
  return server({
    url: `/mv/url?id=${id}`
  })
}
//获取mv评论
export const getMvcomments = (id, limit, offset = 0) => {
  return server({
    url: `/comment/mv?id=${id}&limit=${limit}&offset=${offset}`
  })
}

//获取歌手描述
export const getArtistdesc = id => {
  return server({
    url: `/artist/desc?id=${id}`
  })
}
//获取歌手热门单曲
export const getArtistsongs = id => {
  return server({
    url: `/artists?id=${id}`
  })
}
//获取歌手专辑
export const getArtistalbum = (id, limit = 50, offset = 0) => {
  return server({
    url: `/artist/album?id=${id}&limit=${limit}&offst=${offset}`
  })
}
//获取歌手mv
export const getArtistmv = (id, limit = 30) => {
  return server({
    url: `/artist/mv?id=${id}&limit=${limit}`
  })
}


//获取专辑动态信息
export const getAlbumdata = id => {
  return server({
    url: `/album/detail/dynamic?id=${id}`
  })
}
//获取专辑内容
export const getAlbum = id => {
  return server({
    url: `/album?id=${id}`
  })
}

//并发请求
export const serverAll = (arr) => {
  return axios.all(arr)
}