import React, { useState, useEffect } from "react";
import "./styles.css";

// 网站列表
const WEBSITES = [
  { id: "weibo", name: "微博", apiPath: "/v2/weibo" },
  { id: "zhihu", name: "知乎", apiPath: "/v2/zhihu" },
  { id: "toutiao", name: "今日头条", apiPath: "/v2/toutiao" },
  { id: "xiaohongshu", name: "小红书", apiPath: "/v2/rednote" },
  { id: "tieba", name: "百度贴吧", apiPath: "/v2/baidu/tieba" },
  { id: "baidu", name: "百度", apiPath: "/v2/baidu/hot" },
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

// 通用函数：从API获取网站数据
const fetchWebsiteData = async (apiPath) => {
  try {
    const baseUrl = await findBestApiInstance();
    const response = await fetch(`${baseUrl}${apiPath}`);
    const result = await response.json();
    
    if (result.code === 200 && result.data) {
      // 转换API数据格式为应用所需格式
      console.log(`获取${apiPath}数据:`, result.data);
      return result.data.map((item, index) => ({
        id: index + 1,
        title: item.title,
        link: item.link
      }));
    }
    return [];
  } catch (error) {
    console.error(`获取${apiPath}数据失败:`, error);
    return [];
  }
};

// 获取链接的OG信息（解析内容）
const fetchLinkContent = async (url, title) => {
  // 由于CORS限制和API接口问题，直接使用模拟内容
  // 用户可以通过点击链接按钮在浏览器中打开原始网页查看
  
  // 根据标题生成相关的内容
  const generateContentFromTitle = (title) => {
    return `关于"${title}"的相关分析

一、事件概述
${title} 是当前社交媒体上的热点话题，引发了广泛关注和讨论。本文档将对该事件进行深入分析和总结。

二、背景信息
该话题涉及多个层面的内容，包括但不限于：
1. 事件起因和发展过程
2. 相关各方观点和反应
3. 社会影响和舆论反响

三、关键要点
1. 核心问题分析
2. 各方立场梳理
3. 可能的发展趋势

四、总结与思考
${title} 作为当前的热点话题，反映了当前社会关注的焦点和讨论方向。通过深入分析，我们可以更好地理解相关事件的影响和意义。

---
提示：点击标题栏的🔗按钮可在浏览器中打开原始链接查看详细信息。
`;
  };
  
  return {
    title: title || "文档",
    description: `关于"${title}"的详细内容分析`,
    content: generateContentFromTitle(title)
  };
};

// 生成模拟的文档内容
const generateMockContent = () => {
  return `项目分析报告

一、项目背景
本项目旨在为用户提供一个便捷的资讯阅读平台，通过整合多源数据，为用户提供最新的热点资讯和深度分析。

二、项目目标
1. 提供实时的热点资讯更新
2. 支持多平台数据源整合
3. 优化用户体验，提升阅读效率
4. 确保数据准确性和时效性

三、技术实现
本项目采用现代化的前端技术栈，包括React框架、响应式设计等，确保在不同设备上都能提供良好的使用体验。

四、数据分析
通过收集用户行为数据，我们可以更好地了解用户需求，并针对性地优化产品功能。

五、未来规划
项目将持续更新和优化，计划增加更多实用功能，提升整体服务质量。`;
};


// 主应用组件
const App = () => {
  const [activeWebsite, setActiveWebsite] = useState("weibo");
  const [trendingNews, setTrendingNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [modalPosition, setModalPosition] = useState(null); // null 表示使用CSS居中
  const [modalSize, setModalSize] = useState({ width: 1100, height: 700 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 });

  // 获取所有网站的热门新闻数据
  const generateTrendingNews = async (websiteId) => {
    setIsLoading(true);
    
    // 查找对应网站的API路径
    const website = WEBSITES.find(w => w.id === websiteId);
    
    if (website && website.apiPath) {
      // 从API获取真实数据
      try {
        const realData = await fetchWebsiteData(website.apiPath);
        setIsLoading(false);
        return realData;
      } catch (error) {
        console.error(`获取${website.name}数据失败:`, error);
        setIsLoading(false);
        return [];
      }
    }
    
    // 如果没有配置API路径，返回空数组
    setIsLoading(false);
    return [];
  };

  // 处理新闻标题点击
  const handleNewsClick = async (item) => {
    setIsLoadingContent(true);
    setEditorContent("");
    
    // 显示弹窗
    setSelectedNews(item);
    
    // 获取内容（根据标题生成）
    try {
      const content = await fetchLinkContent(item.link, item.title);
      const formattedContent = formatAsWordDocument(item.title, content.content || content.description || "");
      setEditorContent(formattedContent);
    } catch (error) {
      console.error('加载内容失败:', error);
      setEditorContent(formatAsWordDocument(item.title, generateMockContent()));
    }
    
    setIsLoadingContent(false);
  };

  // 格式化为Word文档样式
  const formatAsWordDocument = (title, content) => {
    const date = new Date().toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return `${title}

${date}

${content}

---
本文档由系统自动生成，仅供内部使用。`;
  };

  useEffect(() => {
    const loadNews = async () => {
      const news = await generateTrendingNews(activeWebsite);
      setTrendingNews(news);
    };

    loadNews();
    // 切换平台时清空选中
    setSelectedNews(null);
    setEditorContent("");
  }, [activeWebsite]);

  // ESC键关闭弹窗
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && selectedNews) {
        setSelectedNews(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedNews]);

  // 拖动处理
  const handleDragStart = (e) => {
    // 如果点击的是关闭按钮，不触发拖动
    if (e.target.className === 'word-close-btn' || e.target.closest('.word-close-btn')) {
      return;
    }
    setIsDragging(true);
    
    // 如果是第一次拖动（位置为null），先计算当前位置
    if (modalPosition === null) {
      const modalElement = e.currentTarget.closest('.word-editor-modal');
      if (modalElement) {
        const rect = modalElement.getBoundingClientRect();
        const currentX = rect.left + rect.width / 2 - window.innerWidth / 2;
        const currentY = rect.top + rect.height / 2 - window.innerHeight / 2;
        setModalPosition({ x: currentX, y: currentY });
        setDragStart({
          x: e.clientX - currentX,
          y: e.clientY - currentY
        });
      }
    } else {
      setDragStart({
        x: e.clientX - modalPosition.x,
        y: e.clientY - modalPosition.y
      });
    }
  };

  const handleDrag = (e) => {
    if (isDragging) {
      setModalPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const minWidth = 800;
      const minHeight = 600;
      const maxWidth = window.innerWidth - 40;
      const maxHeight = window.innerHeight - 40;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStart.width + deltaX));
      const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStart.height + deltaY));
      setModalSize({ width: newWidth, height: newHeight });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // 调整大小处理
  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      width: modalSize.width,
      height: modalSize.height,
      x: e.clientX,
      y: e.clientY
    });
  };

  // 关闭弹窗时重置位置
  useEffect(() => {
    if (!selectedNews) {
      setModalPosition(null);
    }
  }, [selectedNews]);

  // 全局鼠标事件监听
  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, modalPosition, modalSize]);

  return (
    <div className="app">
      {/* 顶部标题栏 */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">Half Time News</h1>
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
                  <div 
                    key={item.id} 
                    className={`news-item ${selectedNews?.id === item.id ? 'selected' : ''}`}
                    onClick={() => handleNewsClick(item)}
                  >
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

          {/* Word编辑器弹窗 */}
          {selectedNews && (
            <div className="word-modal-overlay">
              <div 
                className="word-editor-modal"
                style={{
                  width: `${modalSize.width}px`,
                  height: `${modalSize.height}px`,
                  transform: modalPosition 
                    ? `translate(calc(-50% + ${modalPosition.x}px), calc(-50% + ${modalPosition.y}px))`
                    : undefined
                }}
              >
                {/* Word标题栏 */}
                <div 
                  className="word-title-bar" 
                  onMouseDown={handleDragStart}
                  style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
                  <span className="word-title-text">
                    {selectedNews ? `${selectedNews.title}.docx` : '新建文档.docx'}
                  </span>
                  <div className="word-title-actions">
                    {selectedNews?.link && (
                      <button 
                        className="word-open-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(selectedNews.link, '_blank');
                        }}
                        title="在新标签页打开"
                      >
                        🔗
                      </button>
                    )}
                    <button className="word-close-btn" onClick={() => setSelectedNews(null)}>×</button>
                  </div>
                </div>

              {/* Word菜单栏 */}
              <div className="word-menu-bar">
                <button className="word-menu-item active">文件</button>
                <button className="word-menu-item active">开始</button>
                <button className="word-menu-item">插入</button>
                <button className="word-menu-item">绘图</button>
                <button className="word-menu-item">布局</button>
                <button className="word-menu-item">引用</button>
                <button className="word-menu-item">审阅</button>
                <button className="word-menu-item">视图</button>
              </div>

              {/* Word Ribbon功能区 */}
              <div className="word-ribbon">
                {/* 剪贴板组 */}
                <div className="ribbon-group">
                  <div className="ribbon-group-label">剪贴板</div>
                  <div className="ribbon-buttons">
                    <button className="ribbon-btn" title="剪切">✂️</button>
                    <button className="ribbon-btn" title="复制">📋</button>
                    <button className="ribbon-btn" title="粘贴">📄</button>
                  </div>
                </div>

                {/* 字体组 */}
                <div className="ribbon-group">
                  <div className="ribbon-group-label">字体</div>
                  <div className="ribbon-controls">
                    <select className="ribbon-select">等线</select>
                    <select className="ribbon-select-small">五号</select>
                    <div className="ribbon-btn-group">
                      <button className="ribbon-btn-small" title="增大字号">A<span className="ribbon-btn-up">+</span></button>
                      <button className="ribbon-btn-small" title="减小字号">A<span className="ribbon-btn-down">-</span></button>
                    </div>
                  </div>
                  <div className="ribbon-buttons">
                    <button className="ribbon-btn ribbon-btn-bold" title="粗体">B</button>
                    <button className="ribbon-btn" title="斜体">I</button>
                    <button className="ribbon-btn" title="下划线">U</button>
                    <button className="ribbon-btn" title="删除线">abc</button>
                  </div>
                </div>

                {/* 段落组 */}
                <div className="ribbon-group">
                  <div className="ribbon-group-label">段落</div>
                  <div className="ribbon-buttons">
                    <button className="ribbon-btn" title="项目符号">•</button>
                    <button className="ribbon-btn" title="编号">1.</button>
                    <button className="ribbon-btn" title="减少缩进">←</button>
                    <button className="ribbon-btn" title="增加缩进">→</button>
                  </div>
                  <div className="ribbon-buttons">
                    <button className="ribbon-btn" title="左对齐">☰</button>
                    <button className="ribbon-btn" title="居中">☰</button>
                    <button className="ribbon-btn" title="右对齐">☰</button>
                    <button className="ribbon-btn" title="两端对齐">☰</button>
                  </div>
                </div>

                {/* 样式组 */}
                <div className="ribbon-group ribbon-group-styles">
                  <div className="ribbon-group-label">样式</div>
                  <div className="ribbon-styles">
                    <button className="style-btn">常规</button>
                    <button className="style-btn">无空格</button>
                    <button className="style-btn">标题 1</button>
                    <button className="style-btn">标题 2</button>
                    <button className="style-btn">标题 3</button>
                  </div>
                </div>
              </div>

              {/* 尺子和文档区 */}
              <div className="word-document-wrapper">
                <div className="word-rulers">
                  <div className="word-ruler-horizontal">
                    {Array.from({ length: 20 }, (_, i) => (
                      <span key={i} className="ruler-mark">{i === 0 ? '' : i}</span>
                    ))}
                  </div>
                  <div className="word-ruler-vertical">
                    {Array.from({ length: 30 }, (_, i) => (
                      <span key={i} className="ruler-mark-v">{i === 0 ? '' : i}</span>
                    ))}
                  </div>
                  <div className="word-document">
                    {isLoadingContent ? (
                      <div className="word-loading">
                        <div className="word-loading-spinner"></div>
                        <p>正在加载内容...</p>
                      </div>
                    ) : editorContent ? (
                      <div 
                        className="word-content" 
                        contentEditable 
                        suppressContentEditableWarning
                      >
                        {editorContent}
                      </div>
                    ) : (
                      <div className="word-empty">
                        <p>点击左侧新闻标题开始编辑文档</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Word状态栏 */}
              <div className="word-status-bar">
                <div className="status-left">
                  <span>第1页，共1页</span>
                  <span>字数统计</span>
                </div>
                <div className="status-right">
                  <button className="status-btn">阅读模式</button>
                  <button className="status-btn">缩放 100%</button>
                  <div className="zoom-slider">
                    <span>-</span>
                    <div className="slider-bar"></div>
                    <span>+</span>
                  </div>
                </div>
              </div>

              {/* 调整大小手柄 */}
              <div 
                className="resize-handle"
                onMouseDown={handleResizeStart}
              ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;