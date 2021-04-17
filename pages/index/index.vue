<template>
	<view class="content">
    <!-- 搜索 -->
    <view class="search">
		<view class="searchIcon">
			<i class="iconfont iconfangdajing"></i>
		</view>
      <input @input="searchMusicHandle" v-model="searchMusicData" placeholder-class="" class="uni-input" type="text" placeholder="搜索" />
	  <view class="searchMusicData" v-if="searchMusicData">
		  <ul>
			  <template  v-for="item in searchMusicArray">
					<navigator open-type="redirect" :url="'../../components/musicDetial?id='+item.id">
						<li :key="item.id">
							<text class="musicName">{{ item.name }}</text>
							<template v-for="(item1,index) in item.artists">
								<view :key="item1.id">
									<text>{{ item1.name }}</text><text v-if="index!==item.artists.length-1">/</text>
								</view>
							</template>
						</li>
					</navigator>
			  </template>
		  </ul>
	  </view>
    </view>
	<!-- 轮播图 -->
	<view class="swiper">		
		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500" :circular="true">
			<navigator open-type="redirect" :url="'../../components/musicDetial?id='+item.id" v-for="item in newSongData" :key="item.id">
				<swiper-item>
					<image :src="item.picUrl" mode="widthFix"></image>
				</swiper-item>
			</navigator> 
		</swiper>
	</view>
	</view>
</template> 

<script>
import { newsong,searchMusic } from '@/api/index.js'
export default {
	data() {
		return {
			newSongData:[],
			searchMusicData:'',
			searchMusicArray:[]
		}
	},
	onLoad() {
	  this.getNewSong()
	},
	methods: {
		
		async getNewSong(){
			this.newSongData = await newsong()
		},
		// 搜索音乐
		async searchMusicHandle(){
			let result = await searchMusic(this.searchMusicData)
			this.searchMusicArray = result.songs
		}
	}
}
</script>

<style lang="less">
.content{
  .search{
    height: 70rpx;
    padding: 20rpx 24rpx 20rpx 24rpx;
    background: #FFFFFF;
	position: relative;
	z-index: 1;
	}
	.searchIcon{
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: 48rpx;
	}
    .uni-input{
      height: 100%;
      border-radius: 36rpx;
      background: #F7F7F7;
	  padding-left: 72rpx;
    }
	//搜索结果
	.searchMusicData{
	  height: 750rpx;
	  overflow-y: auto;
	  border-radius: 18rpx;
	  margin-top: 20rpx;
	  background: rgba(212,212,212,0.8);
	  li{
		  padding:32rpx;
		  display: flex;
		  .musicName{
			  flex: 3;
			  overflow: hidden;
			  text-overflow: ellipsis;
			  white-space: nowrap;
		  }
		  .userName{
			  flex: 1;
			  text-align: right;
			  overflow: hidden;
			  text-overflow: ellipsis;
			  white-space: nowrap;
		  }
	  }
	}
	// 轮播图
	.swiper{
		height: 750rpx;
		image{
			width:100%
		}
	}
}
</style>
