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

// API实例列表
const API_INSTANCES = [
  "https://60api.09cdn.xyz",
  "https://60s.zeabur.app",
  "https://60s.crystelf.top",
  "https://cqxx.site",
  "https://api.yanyua.icu",
  "https://60s.tmini.net",
  "https://60s.7se.cn",
];

// 检测API实例是否可用并返回响应时间
const checkApiInstance = async (baseUrl) => {
  const testUrl = `${baseUrl}/v2/weibo`;
  const timeout = 5000; // 5秒超时
  
  try {
    const startTime = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      if (data.code === 200 && data.data) {
        return { available: true, responseTime, url: baseUrl };
      }
    }
    return { available: false, responseTime: Infinity, url: baseUrl };
  } catch (error) {
    return { available: false, responseTime: Infinity, url: baseUrl };
  }
};

// 检测所有实例并选择最快的
const findBestApiInstance = async () => {
  // 检查是否已有存储的实例
  const storedInstance = localStorage.getItem('bestApiInstance');
  if (storedInstance) {
    console.log('使用缓存实例:', storedInstance);
    return storedInstance;
  }

  console.log('开始检测API实例...');
  const results = await Promise.all(
    API_INSTANCES.map(instance => checkApiInstance(instance))
  );

  // 找出所有可用的实例
  const availableInstances = results.filter(r => r.available);
  
  if (availableInstances.length === 0) {
    console.error('没有找到可用的API实例');
    return API_INSTANCES[0]; // 返回第一个作为备用
  }

  // 选择响应时间最短的实例
  const bestInstance = availableInstances.reduce((prev, current) => {
    return prev.responseTime < current.responseTime ? prev : current;
  });

  console.log(`选择最佳实例: ${bestInstance.url}，响应时间: ${bestInstance.responseTime.toFixed(2)}ms`);
  
  // 存储最佳实例
  localStorage.setItem('bestApiInstance', bestInstance.url);
  
  return bestInstance.url;
};

// 从API获取微博热搜数据
const fetchWeiboData = async () => {
  try {
    const baseUrl = await findBestApiInstance();
    const response = await fetch(`${baseUrl}/v2/weibo`);
    const result = await response.json();
    
    if (result.code === 200 && result.data) {
      // 转换API数据格式为应用所需格式
      console.log(result.data);
      return result.data.map((item, index) => ({
        id: index + 1,
        title: item.title,
        link: item.link
      }));
    }
    return [];
  } catch (error) {
    console.error('获取微博热搜失败:', error);
    return [];
  }
};


// 主应用组件
const App = () => {
  const [activeWebsite, setActiveWebsite] = useState("weibo");
  const [trendingNews, setTrendingNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 生成其他网站的热门新闻数据
  const generateTrendingNews = async (websiteId) => {
    if (websiteId === "weibo") {
      // 从API获取真实数据
      setIsLoading(true);
      const realData = await fetchWeiboData();
      setIsLoading(false);
      return realData;
    }
    
    // 其他网站的默认数据
    setIsLoading(false);
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      title: `${WEBSITES.find(w => w.id === websiteId)?.name}热门话题 ${i + 1}`,
    }));
  };

  useEffect(() => {
    const loadNews = async () => {
      const news = await generateTrendingNews(activeWebsite);
      
      // 如果是微博，扩展到50条
      if (activeWebsite === "weibo") {
        const baseNews = news;
        const extendedNews = [...baseNews];
        for (let i = baseNews.length; i < 50; i++) {
          extendedNews.push({
            id: i + 1,
            title: `微博热门话题 ${i + 1}`,
          });
        }
        setTrendingNews(extendedNews);
      } else {
        setTrendingNews(news);
      }
    };

    loadNews();
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

          <main className="main-content">
            <div className="content-header">
              <h2 className="content-title">
                {WEBSITES.find(w => w.id === activeWebsite)?.name}
              </h2>
            </div>

            {/* 新闻列表 */}
            <div className="news-list">
              {trendingNews.length > 0 ? (
                trendingNews.map((item, index) => (
                  <div key={item.id} className="news-item">
                    <span className={`news-rank ${index < 3 ? 'rank-highlight' : ''}`}>
                      {index + 1}
                    </span>
                    <span className="news-title">{item.title}</span>
                  </div>
                ))
              ) : (
                <div className="loading">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="loading-item">
                      <div className="loading-rank"></div>
                      <div className="loading-title"></div>
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