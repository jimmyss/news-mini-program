// let data={
//     cmtList: [{
//         avatar: "../images/1.jpg",
//         nickname: "米兰的卡先生",
//         fabulous: 123,
//         isFabulous: false,
//         content: "我一直没懂赛前问一个主教练如何评价对手的主教练， 记者究竟是想得到什么答案？",
//         reply: [{
//             nickname: "Mesaldo",
//             content: "汉军威武!卓尔不凡!火炉德比，热力四射！场上争胜，场下朋友☺ ☻"
//         }, {
//             nickname: "月牙",
//             content: "新政实行后，大小摩托轮流冲，不用经常上迪力了，杨帅该拿下就拿下☺"
//         }],
//         replayNum: 44,
//         time: "昨天 22:12"
//     }, {
//         avatar: "../images/2.jpg",
//         nickname: "月牙",
//         fabulous: 2,
//         content: "力帆有杨帅，迪力木来提，尹聪耀，完全可以应付。尤其是杨帅坐稳主力后卫。",
//         reply: [{
//             nickname: "thorui",
//             content: "汉军威武!卓尔不凡!火炉德比，热力四射！场上争胜，场下朋友"
//         }, {
//             nickname: "Mr卡卜斯",
//             content: "说实话，武汉重庆还真的是一家，但是比赛还是要分出个胜负来的，我卓尔球迷肯定是要为我武汉加油了，按照目前两队现在这个状态来看武汉重庆应该是五五开，所以我想说武汉加油！卓尔加油！"
//         }],
//         replayNum: 2,
//         time: "昨天 21:09"
//     }, {
//         avatar: "../images/3.jpg",
//         nickname: "thorui",
//         fabulous: 0,
//         content: "小克鲁伊夫带的球队征服了中超球迷，李铁也带队冲超成功，现在风头正劲，究竟鹿死谁手，谁更胜一筹，期待精彩的比赛 ☻ ☻ ☻",
//         reply: [],
//         replayNum: 0,
//         time: "昨天 17:30"
//     }]
// }
let data={}
const fs = require('fs');
const filePath = './data/comments.json';
const express = require('express')
const axios=require('axios');
const cheerio = require('cheerio');
const bodyParser = require('body-parser')
const app = express()
const loadComments = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // 如果文件不存在或读取失败，则返回空数组作为初始评论数据
        return [];
    }
};
// 保存评论数据
const saveComments = (comments) => {
    const data = JSON.stringify(comments);
    fs.writeFileSync(filePath, data, 'utf8');
};
function initialize(){
    data = {
        cmtList: loadComments(),
    };
}
initialize()
app.use(bodyParser.json())

app.get('/api/comment', (req, res)=>{

    console.log('111:', data); // 在控制台输出更新的评论数据
    res.json({cmtList:data.cmtList});

})

app.post('/api/comment', (req, res) => {
    // 接收前端发送的评论数据更新请求
    const updatedCmtList = req.body.cmtList;
    if (updatedCmtList) {

        // 更新评论数据
        data.cmtList = updatedCmtList;
        console.log('Received updatedCmtList:', updatedCmtList); // 在控制台输出更新的评论数据
        saveComments(data.cmtList);
        // 返回更新成功的响应
        res.json({ message: '评论数据更新成功' });

    } else {
        // 请求中未包含有效的评论数据
        res.status(400).json({ error: '无效的请求数据' });
    }
});
const port = 8080; // 设置服务器监听的端口号
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});