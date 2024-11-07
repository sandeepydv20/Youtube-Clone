import React, { useEffect, useState } from 'react'
import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { API_KEY, value_convertor } from '../../data'
import { json, useParams } from 'react-router-dom'
import { data } from '@remix-run/router'
import moment from 'moment'

const PlayVideo = () => {

    const {videoId} = useParams();

    const [apiData, setApiData] = useState(null);

    const [channelData,setChannelData] = useState(null);

    const [commentData,setCommentData] = useState([])

    const fetchVideoData = async () => {
        //Fetching Videos Data
        const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`
        await fetch(videoDetails_url).then(res=>res.json()).then(data=> setApiData(data.items[0]))
    }

    const fetchChannelData =async () => {
        const channelDetail_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`
        await fetch(channelDetail_url).then(res=>res.json()).then(data=>setChannelData(data.items[0]))
    }

    const fetchCommentData = async () => {
        const commentDetail_url = ` https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}`
        await fetch(commentDetail_url).then(res=>res.json()).then(data=>setCommentData(data.items))
    }

    
    useEffect(() => {
        fetchVideoData();
    },[videoId])

    useEffect(() => {
        fetchChannelData()
    },[apiData])

    useEffect(() => {
        fetchCommentData()
    },[videoId])

console.log(commentData)
  
  return (
    <div className='play-video'>
      {/* <video controls autoPlay muted src={video1}></video> */}
      <iframe src={`https://www.youtube.com/embed/${videoId}`}  frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen ></iframe>
      
      <h3>{apiData?apiData.snippet.title:"Title Here"}</h3>
      <div className="play-video-info">
        <p>{value_convertor(apiData?apiData.statistics.viewCount:"")} Views &bull; {moment(apiData?apiData.snippet.publishedAt:"").fromNow()}</p>
        <div>
            <span><img src={like} alt="" />{value_convertor(apiData?apiData.statistics.likeCount:"")}</span>
            <span><img src={dislike} alt="" />2</span>
            <span><img src={share} alt="" />Share</span>
            <span><img src={save} alt="" />Save</span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img src={channelData?channelData.snippet.thumbnails.default.url:""} alt="" />
        <div>
            <p>{channelData?channelData.snippet.title:""}</p>
            <span>{value_convertor(channelData?channelData.statistics.subscriberCount:"")} Subscribers</span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
       
        <p>{channelData?channelData.snippet.description.slice(0,250):""}</p>
        <hr />
        <h4>{value_convertor(apiData?apiData.statistics.commentCount:"")} Comments</h4>

        {commentData.map((items,index) => {
            return(
                <div key={index} className='comment'>
                <img src={items.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                <div>
                    <h3>{items.snippet.topLevelComment.snippet.authorDisplayName} <span>1 Day ago</span></h3>
                    <p>{items.snippet.topLevelComment.snippet.textDisplay.slice(0,50)}</p>
                    <div className="comment-action">
                        <img src={like} alt="" />
                        <span>{value_convertor(items.snippet.topLevelComment.snippet.likeCount)}</span>
                        <img src={dislike} alt="" />
                    </div>
                </div>
            </div>
            )
        })}
       
      </div>
    </div>
  )
}

export default PlayVideo
