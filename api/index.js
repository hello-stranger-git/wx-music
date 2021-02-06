 const baseUrl = 'http://192.168.2.125:3000'
// 推荐新音乐
export function newsong(){
	return new Promise((resolve,reject)=>{
		uni.request({
			url:baseUrl+'/personalized/newsong?limit=10',
			success: (res) => {
				if(res.data.code===200){
					resolve(res.data.result)
				}
			},
			fail:(err)=>{
				console.log('获取推荐新音乐出错:'+err)
				reject(err)
			}
		})
	})
}
//获取音乐
export function getMusic(id){
	return new Promise((resolve,reject)=>{
		uni.request({
			url:baseUrl+'/song/url?id='+id,
			success:(res) => {
				if(res.data.code===200){
					resolve(res.data.data[0])
				}
			}
		})
	})
}
//获取歌词
export function getMusicWorld(id){
	return new Promise((resolve,reject)=>{
		uni.request({
			url:baseUrl+'/lyric?id='+id,
			success:(res) => {
				if(res.data.code===200){
					resolve(res.data.lrc)
				}
			}
		})
	})
}
//搜索歌曲
export function searchMusic(keywords){
	return new Promise((resolve,reject)=>{
		uni.request({
			url:baseUrl+'/search?keywords='+keywords,
			success:(res) => {
				if(res.data.code===200){
					resolve(res.data.result)
				}
			}
		})
	})
}
//获取歌曲详情
export function getMusicDetail(id){
	return new Promise((resolve,reject)=>{
		uni.request({
			url:baseUrl+'/song/detail?ids='+id,
			success:(res) => {
				if(res.data.code===200){
					resolve(res.data.songs[0])
				}
			}
		})
	})
}