let currsong= new Audio();
let songs;
let currfolder;

function convertToMinutesSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    // Format the seconds to always display two digits
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return minutes + ':' + formattedSeconds;
}


function playmusic(songname,pause=false)
{
    currsong.src=`/${currfolder}/`+songname;

   
    if(!pause)
    {
        currsong.play();
       
        play.src="img/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML=songname;

}


async function getsongs(folder)
{
    currfolder=folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text()
    songs=[]
    
    let div = document.createElement("div")
    div.innerHTML=response
    let as=div.getElementsByTagName("a")
    for(let i=0;i<as.length;i++)
        {
            if(as[i].href.endsWith(".mp3"))
                {
                    songs.push(as[i].href.split(`/${folder}/`)[1].replaceAll("%20"," "));
                }
        }
    
        
   let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML="";
   for(let song of songs)
   {
       songUL.innerHTML=  songUL.innerHTML + 
       ` 
                        <li>
                           <img src="img/music.svg" class="invert w2">
                           <div class="p1">${song}</div>
                           <img src="img/play2.svg" class="invert w1" alt="">
                       </li>
       `;
   }


   
   let song_name = document.querySelector(".songlist").getElementsByTagName("li"); //list of Li
   
   playmusic(song_name[0].getElementsByTagName("div")[0].innerHTML,true);

   Array.from(song_name).forEach(e=>{

   e.addEventListener("click", () => {

    playmusic(e.getElementsByTagName("div")[0].innerHTML)
    
    // let b=e.getElementsByTagName("img")[1];
    // if(b.src.includes("play2.svg") )
    // {
    //     b.src=b.src.replace("play2.svg","pause2.svg");
    // }
    // else{
    //     b.src=b.src.replace("pause2.svg","play2.svg");
    //     currsong.pause();
    //      play.src="play3.svg"
    // }

   })
  } )

}

async function display_album()
{
    let a= await fetch("/songs/");
    let response = await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    
    for(let i=1;i<as.length;i++)
    {
        let folder_name = as[i].href.split("/songs/")[1].split("/")[0];
        let container=document.querySelector(".artist_container");

        let ar = await fetch(`/songs/${folder_name}/info.json`);
        let info = await ar.json();

        console.log(folder_name);

        container.innerHTML = container.innerHTML + `
                    <div class="card" data-folder="${folder_name}">
                    <div class="image">
                        <img src="songs/${folder_name}/cover.jpg" alt="">
                    </div>
                    <div class="play">
                        <img src="img/play.svg" alt="">
                    </div>
                    <h5>${info.artist}</h5>
                    <p>Artist</p>
                </div>`
    }

        //dynamic albumbs
        Array.from(document.getElementsByClassName("card")).forEach((e)=>{
            e.addEventListener("click",async (item)=>{
                console.log(item.currentTarget.dataset.folder);
                await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            })
        })
    
}

display_album();


 async function main()
 {
    await getsongs("songs/ncs");


  play.addEventListener("click",()=>{
    if(currsong.paused)
    {
        currsong.play()
        play.src="img/pause.svg"
    }

    else
    {
        currsong.pause()
        play.src="img/play3.svg"
    }

  })

  

  //bar is from x=389 to x=1105
  document.querySelector(".seekbar").addEventListener("click",(e)=>{
    console.log(e.target.getBoundingClientRect().width,e.offsetX);
    let per=(e.offsetX/e.target.getBoundingClientRect().width)*100;

    //document.querySelector(".circle").style.left=per + "%";
    currsong.currentTime=(currsong.duration*per)/100;
  })

  currsong.addEventListener("timeupdate",()=>{
    //console.log(convertToMinutesSeconds(parseInt(currsong.currentTime)),currsong.duration);
    document.querySelector(".songtime").innerHTML=`${convertToMinutesSeconds(parseInt(currsong.currentTime))}/
    ${convertToMinutesSeconds(parseInt(currsong.duration))}`;
    let percent=((currsong.currentTime/currsong.duration)*100);

    document.querySelector(".circle").style.left= (percent) + "%";

    if(percent==100)
    {
    console.log(currsong.src.split("/")[5].replaceAll("%20"," "));

    let index=songs.indexOf(currsong.src.split("/")[5].replaceAll("%20"," ") )
    console.log(index);
    
    if(index+1<songs.length)
        playmusic(songs[index+1]);
    }
 })

 document.querySelector(".ham").addEventListener("click",()=>{
    console.log("click")
    /*document.querySelector(".left").style.left="0 ";*/
    let l=document.querySelector(".left");

    if(l.style.left=="0%")
    {

        l.style.left="-100%";
    }
    else{
        l.style.left="0%";
    }
 })

 previous.addEventListener("click",()=>{
    console.log("previous clicked");

    let index=songs.indexOf(currsong.src.split("/")[5].replaceAll("%20"," "));

    console.log(songs,index);

    if(index-1>=0)
        playmusic(songs[index-1]);
 })

 next.addEventListener("click",()=>{
    console.log("next clicked")
    console.log(currsong.src.split("/")[5].replace("%20"," "));
    console.log(songs); 

    let index=songs.indexOf(currsong.src.split("/")[5].replaceAll("%20"," ") )
    console.log(index);
    
    if(index+1<songs.length)
        playmusic(songs[index+1]);
 })

 document.querySelector(".vol").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    console.log(e.target.value);
    currsong.volume=parseInt(e.target.value)/100;

    if(e.target.value==0)
    {
        document.querySelector(".vol").getElementsByTagName("img")[0].src="disable.svg";
    }
    else{
        document.querySelector(".vol").getElementsByTagName("img")[0].src="enable.svg";
    }
 })

 //harry code for mute 

//  document.querySelector(".vol > img").addEventListener("click",(e)=>{
//     if(e.target.src.includes("enable.svg"))
//     {
//         e.target.src=e.target.src.replace("enable.svg","disable.svg");
//         currsong.volume=0;
//         document.querySelector(".vol").getElementsByTagName("input")[0].value=0;
//     }
//     else{
//         e.target.src=e.target.src.replace("disable.svg","enable.svg",);
//         currsong.volume=0.1;
//         document.querySelector(".vol").getElementsByTagName("input")[0].value=10;
//     }
//  })

 document.querySelector(".vol").getElementsByTagName("img")[0].addEventListener("click",()=>{
   let disp= document.querySelector(".vol").getElementsByTagName("input")[0];
   console.log("helo");
   if(disp.style.display=="none")
   {    
    disp.style.display="block";
   }
   else{
    disp.style.display="none";
   }
})

    //own
    currsong.addEventListener("timeupdate",()=>{
        let list = document.querySelector(".songlist").getElementsByTagName("ul")[0].getElementsByTagName("li");
        let so=currsong.src.split("/")[5].replaceAll("%20"," ");
        
        Array.from(list).forEach(e=>{
            if(e.getElementsByTagName("div")[0].innerHTML.includes(so))
            {
                e.getElementsByTagName("img")[1].src=e.getElementsByTagName("img")[1].src.replace("play2.svg","pause2.svg");
            }
            else{
                e.getElementsByTagName("img")[1].src=e.getElementsByTagName("img")[1].src.replace("pause2.svg","play2.svg");
            }

            if(currsong.paused)
            {
                e.getElementsByTagName("img")[1].src=e.getElementsByTagName("img")[1].src.replace("pause2.svg","play2.svg");
            }
        })
    })

    

    // Array.from(document.getElementsByClassName("play")).forEach((e)=>{
    //     e.addEventListener("click",()=>{
    //         currsong.play();
    //         //play.src="pause.svg";
    //     })
    // })
 
}

 main()