import React, { useState, useEffect } from "react";
import "./styles.css";

// 网站列表
const WEBSITES = [
  { id: "weibo", name: "微博" },
  { id: "zhihu", name: "知乎" },
  { id: "toutiao", name: "今日头条" },
  { id: "xiaohongshu", name: "小红书" },
  { id: "hupu", name: "虎扑" },
  { id: "tieba", name: "百度贴吧" },
];

// 生成微博的热门新闻数据（根据图片）
const generateTrendingNews = (websiteId) => {
  if (websiteId === "weibo") {
    return [
      { id: 1, title: "金赛纶去世", views: 102, isHot: true },
      { id: 2, title: "你设置付款码隐私保护了吗", views: 75 },
      { id: 3, title: "60秒看中国智造齐聚一堂", views: 67.3 },
      { id: 4, title: "公积金三大调整方向持续助力安居", views: 127.3 },
      { id: 5, title: "K总官宣与女友结婚", views: 132.7 },
      { id: 6, title: "最新科技突破引发热议", views: 89.2 },
      { id: 7, title: "娱乐圈新动态引发关注", views: 56.8 },
      { id: 8, title: "体育赛事精彩瞬间回顾", views: 43.5 },
      { id: 9, title: "社会热点话题持续发酵", views: 78.9 },
      { id: 10, title: "生活小技巧分享走红", views: 91.4 },
      { id: 11, title: "美食探店视频获赞无数", views: 65.2 },
      { id: 12, title: "旅行攻略引发网友热议", views: 54.7 },
      { id: 13, title: "职场生存法则分享", views: 112.3 },
      { id: 14, title: "健康生活方式推荐", views: 88.6 },
      { id: 15, title: "教育话题深度讨论", views: 73.1 },
      { id: 16, title: "科技创新成果展示", views: 96.5 },
      { id: 17, title: "文化传承重要性探讨", views: 59.8 },
      { id: 18, title: "环保理念实践分享", views: 82.4 },
    ];
  }
  
  // 其他网站的默认数据
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `${WEBSITES.find(w => w.id === websiteId)?.name}热门话题 ${i + 1}`,
    views: Math.floor(Math.random() * 200) + 10,
    isHot: false,
  }));
};

// 主应用组件
const App = () => {
  const [activeWebsite, setActiveWebsite] = useState("weibo");
  const [trendingNews, setTrendingNews] = useState([]);

  useEffect(() => {
    setTrendingNews([]);
    const timer = setTimeout(() => {
      const news = generateTrendingNews(activeWebsite);
      // 如果是微博，扩展到50条
      if (activeWebsite === "weibo") {
        const baseNews = news;
        const extendedNews = [...baseNews];
        for (let i = baseNews.length; i < 50; i++) {
          extendedNews.push({
            id: i + 1,
            title: `微博热门话题 ${i + 1}`,
            views: Math.floor(Math.random() * 150) + 20,
            isHot: false,
          });
        }
        setTrendingNews(extendedNews);
      } else {
        setTrendingNews(news);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [activeWebsite]);

  return (
    <div className="app">
      {/* 顶部标题栏 */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">阅读</h1>
        </div>
      </header>

      {/* 主内容区域 */}
      <div className="main-container">
        <div className="content-wrapper">
          {/* 左侧导航栏 */}
          <aside className="sidebar">
            <nav className="nav">
              <ul className="nav-list">
                {WEBSITES.map((website, index) => (
                  <li key={website.id} className="nav-item">
                    <button
                      onClick={() => setActiveWebsite(website.id)}
                      className={`nav-button ${activeWebsite === website.id ? 'active' : ''}`}
                    >
                      <span className="nav-number">{index + 1}</span>
                      <span className="nav-name">{website.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* 右侧内容区 */}
          <main className="main-content">
            {/* 标题区域 */}
            <div className="content-header">
              <h2 className="content-title">
                {WEBSITES.find(w => w.id === activeWebsite)?.name} 热门
              </h2>
              <p className="content-subtitle">实时点击率前50</p>
            </div>

            {/* 新闻列表 */}
            <div className="news-list">
              {trendingNews.length > 0 ? (
                trendingNews.map((item, index) => (
                  <div key={item.id} className="news-item">
                    {index === 0 && item.isHot ? (
                      <div className="hot-badge">爆</div>
                    ) : (
                      <span className={`news-rank ${index < 3 && !item.isHot ? 'rank-highlight' : ''}`}>
                        {index + 1}
                      </span>
                    )}
                    <span className="news-title">{item.title}</span>
                    <span className="news-views">{item.views.toFixed(item.views % 1 === 0 ? 0 : 1)}万</span>
                  </div>
                ))
              ) : (
                <div className="loading">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="loading-item">
                      <div className="loading-rank"></div>
                      <div className="loading-title"></div>
                      <div className="loading-views"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
