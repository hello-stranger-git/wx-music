<template>
	<!--音乐详情-->
	<view class="musicDetail">
		<!-- 图片部分 -->
		<view class="top">
			<view class="imgView" v-if="!toggleWord"  @click="toggleWordHanldle">
				<image :src="songDetial.al.picUrl" mode="widthFix"/>
			</view>
			<view v-else>
				<text @click="toggleWordHanldle">{{ musicWord.lyric }}</text>
			</view>
		</view>
		<!--中间操作部分-->
		<view class="center">
			<view class="like">
				<i class="iconfont iconxihuan" v-if="!like" @click="likeToggle"></i>
				<i v-else class="iconfont iconxihuan1" @click="likeToggle"></i>
			</view>
			<view class="downLoad">
				<i class="iconfont icondownload"></i>
			</view>
			<view class="comment">
				<i class="iconfont iconjianyi"></i>
			</view>
		</view>
		<!--进度条部分-->
		<view class="progress">
			<view class="left">
				<text>{{ $utils.formatSongTime(currentTime) }}</text>
			</view>
			<view class="pro">
				<view class="progress-box">
					<progress :percent="percent" stroke-width="3" />
				</view>
			</view>
			<view class="right">
				<text>{{ duration }}</text>
			</view>
		</view>
		
		<!-- 按钮部分 -->
		<view class="bottom">
			<view class="model">
				<i v-if="model===0" class="iconfont iconliebiaoxunhuan" @click="modelToggle"/>
				<i v-if="model===1" class="iconfont iconsuijibofang01" @click="modelToggle"/>
				<i v-if="model===2" class="iconfont iconhanhan-01-01" @click="modelToggle"/>
			</view>
			<view class="play">
				<view class="left">
					<i class="iconfont iconjiantou_xianxing_zuo" @click="up"/>
				</view>
				<view class="play">
					<i :class="['iconfont',play?'iconicon_bofang':'iconbofang1']" @click="playHandle"/>
				</view>
				<view class="right">
					<i class="iconfont iconjiantou_xianxing_you" @click="next"/>
				</view> 		
			</view>
			<view class="list">
				<i class="iconfont iconRectangleCopy"/>
			</view>
		</view>
	</view> 
</template>

<script>
	import { getMusic,getMusicWorld,getMusicDetail,getSimiMusic } from '@/api/index.js'
	import utils from '@/utils/utils.js'
	const innerAudioContext = uni.createInnerAudioContext();
	export default {
		data() {
			return {
				song:{},//当前音乐
				songDetial:{},//音乐详情
				id:'',
				play:true,//是否播放
				musicWord:'',//音乐歌词
				toggleWord:false,//歌词与封面的切换
				loop:false,//是否循环
				model:0,//模式切换（0、列表循环，1、随机播放，2、单曲循环）
				like:false,//是否喜欢
				simiMusicIdArray:[],//相似音乐的id
				duration:0,//当前音频总共长度
				currentTime:'00:00',//当前播放时长
				currentTimeTimeout:'',//定时器
				percent:0,//进度条
			}
		},
		async onLoad(options) {
			this.id = options.id
			await this.getMusicItem()
			await this.playMusic()
			await this.getMusicWord()
		},
		methods: {
			// 获取音乐以及歌曲详情
			async getMusicItem(){
				this.song = await getMusic(this.id)
				this.songDetial = await getMusicDetail(this.id)
				console.log(this.songDetial.dt)
				this.duration = utils.formatSongTime(this.songDetial.dt)
			},
			// 控制播放按钮
			playHandle(){
				this.play = !this.play
				this.playMusic()
			},
			//音乐播放暂停操作
			playMusic(){
				innerAudioContext.src = this.song.url;
				this.currentTimeTimeout = setTimeout(() => {
					innerAudioContext.duration
				    innerAudioContext.onTimeUpdate(() => {
				      this.currentTime = (innerAudioContext.currentTime)*1000 //当前播放进度
				    })
				  }, 500)
				if(this.play){
				innerAudioContext.play();
				}else{
					innerAudioContext.pause() //暂停
				}
			},
			//获取歌词操作
			async getMusicWord(){
				this.musicWord = await getMusicWorld(this.id)
			},
			//切换歌词与图片
			toggleWordHanldle(){
				this.toggleWord= !this.toggleWord
			},
			//模式切换
			modelToggle(){
				this.model+=1
				if(this.model>2){
					this.model=0
				}
			},
			//下一首歌曲
			async next(){
				this.play = true
				await this.getSimiMusicHandle()
			},
			//上一首歌曲
			async up(){
				this.play = true
				await this.getSimiMusicHandle()
			},
			//切换是否喜欢
			likeToggle(){
				this.like = !this.like
			},
			//获取相似歌曲
			async getSimiMusicHandle(){
				let simiMusicArray = await getSimiMusic(this.id)
				this.simiMusicIdArray = simiMusicArray.map((item)=>item.privilege.id)
				this.id = this.simiMusicIdArray[parseInt(Math.random()*5)]
			}
		},
		watch:{
			model:function(newValue,oldValue){
				innerAudioContext.loop = false
				if(newValue===0){
				}else if(newValue===1){
					
				}else if(newValue===2){
					this.loop = true
					innerAudioContext.loop = this.loop
				}
			},
			id:async function(newValue,oldValue){
				await this.getMusicItem()
				await this.playMusic()
				await this.getMusicWord()
			},
			currentTime:function(newValue,oldValue){
				console.log(newValue,this.songDetial.dt)
				console.log(Math.ceil((newValue/this.songDetial.dt)*100))
				this.percent = Math.ceil((newValue/this.songDetial.dt)*100)
			},
		}
	}
</script>

<style lang="less" scoped>
.musicDetail{
	position: relative;
	min-height: 100vh;
	.top{
		height: 740rpx;
		width: 750rpx;
		position: relative;    
		overflow-y: auto;
		.imgView{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			image{
				width: 600rpx;
				height: 600rpx;
				border-radius: 50%;
				animation:rotate 8s linear infinite;
				box-shadow: 10px 10px 50rpx #888888;
			}
		}
	}
	.center{
		display: flex;
		justify-content: space-around;
		box-sizing: border-box;
		position: absolute;
		bottom: 350rpx;
		width: 750rpx;
		i{
			font-size: 60rpx;
		}
		.iconxihuan1{
			color: red;
		}
	}
	
	.progress{
		display: flex;
		padding: 0 20rpx;
		justify-content: space-between;
		align-items: center;
		position: absolute;
		bottom: 250rpx;
		width: 750rpx;
		box-sizing: border-box;
		.left{
			flex: 1;
		}
		.pro{
			flex: 3;
		}
		.right{
			flex: 1;
			text-align: right;
		}
	}
	.bottom{
		display: flex;
		justify-content: space-around;
		width: 750rpx;
		padding: 0 70rpx;
		box-sizing: border-box;
		position: absolute;
		bottom: 80rpx;
		i{
			font-size: 100rpx;
		}
		.model{
			display: flex;
			flex: 1;
			align-items: center;
			i{
				font-size: 55rpx;
			}
		}
		.play{
			flex: 3;
			display: flex;
			justify-content: space-around;
			align-items: center;
			.left,.right{
				i{
					font-size: 65rpx;
				}
			}
		}
		.list{
			display: flex;
			flex: 1;
			align-items: center;
			justify-content: flex-end;
			i{
				font-size: 55rpx;
			}
		}
	}
	@keyframes rotate{
		  0%{transform:rotate(0deg);}
		  25%{transform:rotate(90deg);}
		  50%{transform:rotate(180deg);}
		  75%{transform:rotate(270deg);}
		  100%{transform:rotate(360deg);}
	}
}

</style>