//链接数据库
const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'lion12345',
  database: 'test'
});

const fs = require('fs');
const filePath = './data/comments.json';
const express = require('express')
const axios=require('axios');
const cheerio = require('cheerio');
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

//comment
const loadComments = () => {
  try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
  } catch (error) {
      // 如果文件不存在或读取失败，则返回空数组作为初始评论数据
      return [];
  }
};
// news
const loadNews = () => {
  try {
      const data = fs.readFileSync('data/news.json', 'utf8');
      return JSON.parse(data);
  } catch (error) {
      // 如果文件不存在或读取失败，则返回空数组作为初始评论数据
      return [];
  }
};
// 保存评论数据
const saveComments = (comments) => {
  const cmtData = JSON.stringify(comments);
  fs.writeFileSync(filePath, cmtData, 'utf8');
};

let data = loadNews();
let cmtData = {
  cmtList: loadComments(),
};

app.use(bodyParser.json())

app.get('/api/comment', (req, res)=>{

  console.log('new comment:', cmtData); // 在控制台输出更新的评论数据
  res.json({cmtList:cmtData.cmtList});

})

app.post('/api/comment', (req, res) => {
  // 接收前端发送的评论数据更新请求
  const updatedCmtList = req.body.cmtList;
  if (updatedCmtList) {

      // 更新评论数据
      cmtData.cmtList = updatedCmtList;
      console.log('Received updatedCmtList:', updatedCmtList); // 在控制台输出更新的评论数据
      saveComments(cmtData.cmtList);
      // 返回更新成功的响应
      res.json({ message: '评论数据更新成功' });

  } else {
      // 请求中未包含有效的评论数据
      res.status(400).json({ error: '无效的请求数据' });
  }
});
//end-comment

async function fetchNewsContent(url) {
  try {
    const response = await axios.get(url);
    const htmlContent = response.data; // 网页内容的字符串

    const $ = cheerio.load(htmlContent);
    const articleContent = $('#ArticleContent'); // 选择包含新闻正文的元素

    // 提取 class="one-p" 的内容
    const onePElements = articleContent.find('.one-p');
    const newsContent = onePElements.map((index, element) => $(element).text()).get();
    // 返回新闻内容给前端
    return newsContent;
  } catch (error) {
    console.error('获取新闻内容失败:', error);
    throw error;
  }
}

// 设置路由，处理触底加载功能
app.get('/api/homepage/bottom', (req, res) => {
  const { pageNum } = req.query;
  const {bios}=req.query;
  const pageSize = 10;
  
  // 将 pageNum 转换为数字类型
  const pageNumber = parseInt(pageNum);
  const bios_=parseInt(bios);
  
  // 计算开始和结束索引
  const startIndex = (pageNumber * pageSize+bios_)%80;
  const endIndex = startIndex + pageSize;
  
  const new_pageNumber=Math.floor(startIndex/pageSize)+1;
  //调整结束地址
  if(endIndex>80){
    const endIndex1=80;
    const startIndex2=0;
    const endIndex2=endIndex%80;
    const newsData=data.newsList.slice(startIndex, endIndex1);
    const finalData=newsData.concat(data.newsList.slice(startIndex2, endIndex2));
    res.json({news:finalData,pageNum:new_pageNumber, bios:bios});
  }
  else{
    const newsData=data.newsList.slice(startIndex, endIndex);
    res.json({news:newsData,pageNum:new_pageNumber});
  }
});

// 设置路由， 处理加载界面功能
app.get('/api/homepage/load', (req, res)=>{
  const pageSize=10;
  const min=1;
  const max=data.newsList.length/pageSize;

  //生成页码和页内偏移量
  const pageNum=Math.floor(Math.random()*(max-min+1))+min;
  const bios=Math.floor(Math.random()*9);
  
  //计算起始地址和结束地址
  const startIndex=(pageNum-1)*pageSize+bios;
  const endIndex=startIndex+pageSize;
  if(endIndex>80){
    const endIndex1=80;
    const startIndex2=0;
    const endIndex2=endIndex%80;
    const newsData=data.newsList.slice(startIndex, endIndex1);
    const finalData=newsData.concat(data.newsList.slice(startIndex2, endIndex2));
    res.json({news:finalData,pageNum:pageNum, bios:bios});
  }
  else{
    const newsData=data.newsList.slice(startIndex, endIndex);
    res.json({news:newsData,pageNum:pageNum, bios:bios});
  }
})

//处理下拉刷新功能
app.get('/api/homepage/pull', (req, res)=>{
  const{pageNum}=req.query;
  const{bios}=req.query;
  const pageSize=10;

  const pageNumber=parseInt(pageNum);
  const bios_=parseInt(bios);

  //将pageNum加一，然后计算起始地址
  const startIndex=(pageNumber*pageSize+bios_)%80;
  const endIndex=startIndex+pageSize;
  const new_pageNumber=Math.floor(startIndex/pageSize)+1;
  //调整结束地址
  if(endIndex>80){
    const endIndex1=80;
    const startIndex2=0;
    const endIndex2=endIndex%80;
    const newsData=data.newsList.slice(startIndex, endIndex1);
    const finalData=newsData.concat(data.newsList.slice(startIndex2, endIndex2));
    res.json({news:finalData,pageNum:new_pageNumber, bios:bios});
  }
  else{
    const newsData=data.newsList.slice(startIndex, endIndex);
    res.json({news:newsData,pageNum:new_pageNumber});
  }
})

//获取新闻内容
app.post('/api/detail', async(req, res)=>{
  const id=parseInt(req.body.id);
  //const parsedId=parseInt(id);
  var newsInfo=data.newsList[id];
  console.log(newsInfo);
  const newsContent=await fetchNewsContent(newsInfo.url);
  console.log(newsContent)
  //根据newsInfo中的新闻url链接获取对应链接的新闻正文内容
  res.json({news:newsInfo, content:newsContent});
})

//获取新闻内容
app.post('/api/detail/favorite', async(req, res)=>{
    //const{index, pageNum, bios}=req.body;
    const id=parseInt(req.body.id);
    const index = data.newsList.findIndex(ele => ele.id==id);
    var newsInfo = data.newsList[index];
    console.log(newsInfo);
    const newsContent= await fetchNewsContent(newsInfo.url);
    res.json({news:newsInfo, content:newsContent});

})

//收藏页面加载
app.get('/api/favorite/load', (req, res)=>{
    const newsData = data.newsList.filter(ele => ele.isCollected > 0)
    const pageNum =1;
    const bios =0;
    const num = newsData.length;
    res.json({news:newsData,pageNum:pageNum, bios:bios,num:num});
})

//改变收藏状态
app.post('/api/favorite/change', async(req, res)=>{
    const id = req.body.id;
    const index = data.newsList.findIndex(ele => ele.id == id);
    data.newsList[index].isCollected = -data.newsList[index].isCollected +1;
    console.log(data.newsList[index].isCollected);
    res.json();
})

// 启动服务器
const port = 3000; // 设置服务器监听的端口号
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
