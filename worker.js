const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的电视</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .page-bg {
            background: #000;
            min-height: 100vh;
            background-image: 
                radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%),
                radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.2) 2%, transparent 0%);
            background-size: 100px 100px;
        }
        .card-hover {
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .card-hover:hover {
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
        }
        .gradient-text {
            background: linear-gradient(to right, #fff, #999);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .settings-panel {
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        .settings-panel.show {
            transform: translateX(0);
        }
        
        /* 自定义滚动条样式 */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: #111;
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #333;
            border-radius: 4px;
            transition: all 0.3s ease;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: #444;
        }
        
        /* Firefox 滚动条样式 */
        * {
            scrollbar-width: thin;
            scrollbar-color: #333 #111;
        }
    </style>
</head>
<body class="page-bg text-white">
    <div class="fixed top-4 right-4 z-50 flex items-center space-x-4">
        <button onclick="toggleSettings(event)" class="bg-[#222] hover:bg-[#333] border border-[#333] hover:border-white rounded-lg px-4 py-2 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
        </button>
    </div>

    <!-- 设置面板 -->
    <div id="settingsPanel" class="settings-panel fixed right-0 top-0 h-full w-80 bg-[#111] border-l border-[#333] p-6 z-40">
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold gradient-text">设置</h3>
            <button onclick="toggleSettings()" class="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">选择采集站点</label>
                <select id="apiSource" class="w-full bg-[#222] border border-[#333] text-white px-3 py-2 rounded-lg focus:outline-none focus:border-white transition-colors">
                    <option value="heimuer">黑莓影视</option>
                    <option value="dyttzy">电影天堂资源</option>
                    <option value="tyyszy">天涯资源</option>
                    <option value="qilin"> 麒麟</option>
                    <option value="jisu">极速</option>
                    <option value="dbzy">豆瓣资源</option>
                    <option value="mozhua">魔爪资源</option>
                    <option value="mdzy">魔都资源</option>
                    <option value="ffzy">非凡影视</option>
                    <option value="zuid">最大资源</option>
                    <option value="bfzy">暴风资源</option>
                    <option value="ruyi">如意资源</option>
                    <option value="custom">自定义接口</option>
                </select>
            </div>
            
            <!-- 添加自定义接口输入框 -->
            <div id="customApiInput" class="hidden">
                <label class="block text-sm font-medium text-gray-400 mb-2">自定义接口地址</label>
                <input 
                    type="text" 
                    id="customApiUrl" 
                    class="w-full bg-[#222] border border-[#333] text-white px-3 py-2 rounded-lg focus:outline-none focus:border-white transition-colors"
                    placeholder="请输入接口地址..."
                >
            </div>
            
            <div class="mt-4">
                <p class="text-xs text-gray-500">当前站点代码：
                    <span id="currentCode" class="text-white"></span>
                    <span id="siteStatus" class="ml-2"></span>
                </p>
            </div>
        </div>
    </div>

    <div class="container mx-auto px-4 py-8 flex flex-col h-screen">
        <div class="flex-1 flex flex-col">
            <!-- 搜索区域：默认居中 -->
            <div id="searchArea" class="flex-1 flex flex-col items-center justify-center">
                <h1 class="text-5xl font-bold gradient-text mb-12">视频搜索</h1>
                <div class="w-full max-w-2xl">
                    <div class="flex">
                        <input type="text" 
                               id="searchInput" 
                               class="w-full bg-[#111] border border-[#333] text-white px-6 py-4 rounded-l-lg focus:outline-none focus:border-white transition-colors" 
                               placeholder="搜索你喜欢的视频...">
                        <button onclick="search()" 
                                class="px-8 py-4 bg-white text-black font-medium rounded-r-lg hover:bg-gray-200 transition-colors">
                            搜索
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- 搜索结果：初始隐藏 -->
            <div id="resultsArea" class="w-full hidden">
                <div id="results" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                </div>
            </div>
        </div>
    </div>

    <!-- 详情模态框 -->
    <div id="modal" class="fixed inset-0 bg-black/95 hidden flex items-center justify-center">
        <div class="bg-[#111] p-8 rounded-lg w-11/12 max-w-4xl border border-[#333] max-h-[90vh] flex flex-col">
            <div class="flex justify-between items-center mb-6 flex-none">
                <h2 id="modalTitle" class="text-2xl font-bold gradient-text"></h2>
                <button onclick="closeModal()" class="text-gray-400 hover:text-white text-2xl transition-colors">&times;</button>
            </div>
            <div id="modalContent" class="overflow-auto flex-1 min-h-0">
                <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                </div>
            </div>
        </div>
    </div>

    <!-- 错误提示框 -->
    <div id="toast" class="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 opacity-0 -translate-y-full">
        <p id="toastMessage"></p>
    </div>

    <!-- 添加 loading 提示框 -->
    <div id="loading" class="fixed inset-0 bg-black/80 hidden items-center justify-center z-50">
        <div class="bg-[#111] p-8 rounded-lg border border-[#333] flex items-center space-x-4">
            <div class="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p class="text-white text-lg">加载中...</p>
        </div>
    </div>

    <script>
        let currentApiSource = localStorage.getItem('currentApiSource') || 'heimuer';
        let customApiUrl = localStorage.getItem('customApiUrl') || '';

        // 初始化时检查是否使用自定义接口
        if (currentApiSource === 'custom') {
            document.getElementById('customApiInput').classList.remove('hidden');
            document.getElementById('customApiUrl').value = customApiUrl;
        }

        // 设置 select 的默认选中值
        document.getElementById('apiSource').value = currentApiSource;

        function toggleSettings(e) {
            // 阻止事件冒泡，防止触发document的点击事件
            e && e.stopPropagation();
            const panel = document.getElementById('settingsPanel');
            panel.classList.toggle('show');
        }

        async function testSiteAvailability(source) {
            try {
                const apiParams = source === 'custom' 
                    ? '&customApi=' + encodeURIComponent(customApiUrl)
                    : '&source=' + source;
                    
                const response = await fetch('/api/search?wd=test' + apiParams);
                const data = await response.json();
                return data.code !== 400;
            } catch (error) {
                return false;
            }
        }

        function updateSiteStatus(isAvailable) {
            const statusEl = document.getElementById('siteStatus');
            if (isAvailable) {
                statusEl.innerHTML = '<span class="text-green-500">●</span> 可用';
            } else {
                statusEl.innerHTML = '<span class="text-red-500">●</span> 不可用';
            }
        }

        document.getElementById('apiSource').addEventListener('change', async function(e) {
            currentApiSource = e.target.value;
            const customApiInput = document.getElementById('customApiInput');
            
            if (currentApiSource === 'custom') {
                customApiInput.classList.remove('hidden');
                customApiUrl = document.getElementById('customApiUrl').value;
                localStorage.setItem('customApiUrl', customApiUrl);
                // 自定义接口不立即测试可用性
                document.getElementById('siteStatus').innerHTML = '<span class="text-gray-500">●</span> 待测试';
            } else {
                customApiInput.classList.add('hidden');
                // 非自定义接口立即测试可用性
                showToast('正在测试站点可用性...', 'info');
                const isAvailable = await testSiteAvailability(currentApiSource);
                updateSiteStatus(isAvailable);
                
                if (!isAvailable) {
                    showToast('当前站点不可用，请尝试其他站点', 'error');
                } else {
                    showToast('站点可用', 'success');
                }
            }
            
            localStorage.setItem('currentApiSource', currentApiSource);
            document.getElementById('currentCode').textContent = currentApiSource;
            
            // 清理搜索结果
            document.getElementById('results').innerHTML = '';
            document.getElementById('searchInput').value = '';
        });

        // 修改自定义接口输入框的事件监听
        document.getElementById('customApiUrl').addEventListener('blur', async function(e) {
            customApiUrl = e.target.value;
            localStorage.setItem('customApiUrl', customApiUrl);
            
            if (currentApiSource === 'custom' && customApiUrl) {
                showToast('正在测试接口可用性...', 'info');
                const isAvailable = await testSiteAvailability('custom');
                updateSiteStatus(isAvailable);
                
                if (!isAvailable) {
                    showToast('接口不可用，请检查地址是否正确', 'error');
                } else {
                    showToast('接口可用', 'success');
                }
            }
        });

        // 初始化显示当前站点代码和状态
        document.getElementById('currentCode').textContent = currentApiSource;
        testSiteAvailability(currentApiSource).then(updateSiteStatus);

        function showToast(message, type = 'error') {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            
            const bgColors = {
                'error': 'bg-red-500',
                'success': 'bg-green-500',
                'info': 'bg-blue-500'
            };
            
            const bgColor = bgColors[type] || bgColors.error;
            toast.className = \`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 \${bgColor} text-white\`;
            toastMessage.textContent = message;
            
            // 显示提示
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
            
            // 3秒后自动隐藏
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(-100%)';
            }, 3000);
        }

        // 添加显示/隐藏 loading 的函数
        function showLoading() {
            const loading = document.getElementById('loading');
            loading.style.display = 'flex';
        }

        function hideLoading() {
            const loading = document.getElementById('loading');
            loading.style.display = 'none';
        }

        async function search() {
            showLoading();
            const query = document.getElementById('searchInput').value;
            const apiParams = currentApiSource === 'custom' 
                ? '&customApi=' + encodeURIComponent(customApiUrl)
                : '&source=' + currentApiSource;
            
            try {
                const response = await fetch('/api/search?wd=' + encodeURIComponent(query) + apiParams);
                const data = await response.json();
                
                if (data.code === 400) {
                    showToast(data.msg);
                    return;
                }
                
                // 显示结果区域，调整搜索区域
                document.getElementById('searchArea').classList.remove('flex-1');
                document.getElementById('searchArea').classList.add('mb-8');
                document.getElementById('resultsArea').classList.remove('hidden');
                
                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = data.list.map(item => \`
                    <div class="card-hover bg-[#111] rounded-lg overflow-hidden cursor-pointer p-6 h-fit" onclick="showDetails('\${item.vod_id}','\${item.vod_name}')">
                        <h3 class="text-xl font-semibold mb-3">\${item.vod_name}</h3>
                        <p class="text-gray-400 text-sm mb-2">\${item.type_name}</p>
                        <p class="text-gray-400 text-sm">\${item.vod_remarks}</p>
                    </div>
                \`).join('');
            } catch (error) {
                showToast('搜索请求失败，请稍后重试');
            } finally {
                hideLoading();
            }
        }

        async function showDetails(id,vod_name) {
            showLoading();
            try {
                const apiParams = currentApiSource === 'custom' 
                    ? '&customApi=' + encodeURIComponent(customApiUrl)
                    : '&source=' + currentApiSource;
                    
                const response = await fetch('/api/detail?id=' + id + apiParams);
                const data = await response.json();
                
                const modal = document.getElementById('modal');
                const modalTitle = document.getElementById('modalTitle');
                const modalContent = document.getElementById('modalContent');
                
                modalTitle.textContent = vod_name;
                modalContent.innerHTML = \`
                    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        \${data.episodes.map((episode, index) => \`
                            <button onclick="playVideo('\${episode}','\${vod_name}')" 
                                    class="px-4 py-2 bg-[#222] hover:bg-[#333] border border-[#333] hover:border-white rounded-lg transition-colors text-center">
                                第\${index + 1}集
                            </button>
                        \`).join('')}
                    </div>
                \`;
                
                modal.classList.remove('hidden');
            } catch (error) {
                showToast('获取详情失败，请稍后重试');
            } finally {
                hideLoading();
            }
        }

        function closeModal() {
            document.getElementById('modal').classList.add('hidden');
            // 清除 iframe 内容
            document.getElementById('modalContent').innerHTML = '';
        }

        function playVideo(url,vod_name) {
            showLoading();
            const modalContent = document.getElementById('modalContent');
            const currentTitle = modalTitle.textContent.split(' - ')[0];
            const currentHtml = modalContent.innerHTML;
            
            // 从当前点击的按钮获取集数
            const episodeNumber = event.target.textContent.replace(/[^0-9]/g, '');
            
            // 更新标题显示
            modalTitle.textContent = vod_name + " - 第" + episodeNumber + "集";
            
            // 先移除现有的视频播放器（如果存在）
            const existingPlayer = modalContent.querySelector('.video-player');
            if (existingPlayer) {
                existingPlayer.remove();
            }
            
            // 如果是第一次播放，保存集数列表
            if (!modalContent.querySelector('.episodes-list')) {
                modalContent.innerHTML = \`
                    <div class="space-y-6">
                        <div class="video-player">
                            <iframe 
                                src="https://hoplayer.com/index.html?url=\${url}&autoplay=true"
                                width="100%" 
                                height="600" 
                                frameborder="0" 
                                scrolling="no" 
                                allowfullscreen="true"
                                onload="hideLoading()">
                            </iframe>
                        </div>
                        <div class="episodes-list mt-6">
                            \${currentHtml}
                        </div>
                    </div>
                \`;
            } else {
                // 如果已经有集数列表，只更新视频播放器
                const episodesList = modalContent.querySelector('.episodes-list');
                modalContent.innerHTML = \`
                    <div class="space-y-6">
                        <div class="video-player">
                            <iframe 
                                src="https://hoplayer.com/index.html?url=\${url}&autoplay=true"
                                width="100%" 
                                height="600" 
                                frameborder="0" 
                                scrolling="no" 
                                allowfullscreen="true"
                                onload="hideLoading()">
                            </iframe>
                        </div>
                        <div class="episodes-list mt-6">
                            \${episodesList.innerHTML}
                        </div>
                    </div>
                \`;
            }
        }

        // 点击外部关闭设置面板
        document.addEventListener('click', function(e) {
            const panel = document.getElementById('settingsPanel');
            const settingsButton = document.querySelector('button[onclick="toggleSettings()"]');
            
            if (!panel.contains(e.target) && !settingsButton.contains(e.target) && panel.classList.contains('show')) {
                panel.classList.remove('show');
            }
        });

        // 回车搜索
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                search();
            }
        });
    </script>
</body>
</html>
`;

const API_SITES = {
    heimuer: {
        api: 'https://json.heimuer.xyz',
        name: '黑木耳',
        detail: 'https://heimuer.tv',
    },

    ffzy: {
        api: 'http://ffzy5.tv',
        name: '非凡影视',
        detail: 'http://ffzy5.tv',
    },
    
    dyttzy: {
        api: 'https://caiji.dyttzyapi.com/api.php/provide/vod',
        name: '电影天堂资源',
    },
    ruyi: {
        api: 'https://cj.rycjapi.com/api.php/provide/vod',
        name: '如意资源',
    },
    bfzy: {
        api: 'https://bfzyapi.com/api.php/provide/vod',
        name: '暴风资源',
    },
    tyyszy: {
        api: 'https://tyyszy.com/api.php/provide/vod',
        name: '天涯资源',
    },
     qilin: {
        api: 'https://www.qilinzyz.com/api.php/provide/vod',
        name: '麒麟资源',
    },
    jisu: {
        api: 'https://jszyapi.com/api.php/provide/vod',
        name: '极速资源',
        detail: 'https://jszyapi.com', 
    },
    dbzy: {
        api: 'https://dbzy.tv/api.php/provide/vod',
        name: '豆瓣资源',
    },
    mozhua: {
        api: 'https://mozhuazy.com/api.php/provide/vod',
        name: '魔爪资源',
    },
    mdzy: {
        api: 'https://www.mdzyapi.com/api.php/provide/vod',
        name: '魔都资源',
    },
    zuid: {
        api: 'https://api.zuidapi.com/api.php/provide/vod',
        name: '最大资源'
    },
    yinghua: {
        api: 'https://m3u8.apiyhzy.com/api.php/provide/vod',
        name: '樱花资源'
    },
    baidu: {
        api: 'https://api.apibdzy.com/api.php/provide/vod',
        name: '百度云资源'
    },
    wujin: {
        api: 'https://api.wujinapi.me/api.php/provide/vod',
        name: '无尽资源'
    },
    wwzy: {
        api: 'https://wwzy.tv/api.php/provide/vod',
        name: '旺旺短剧'
    },
};

async function handleRequest(request) {
    const url = new URL(request.url);
    const customApi = url.searchParams.get('customApi') || '';
    // API 路由处理
    if (url.pathname === '/api/search') {
        const searchQuery = url.searchParams.get('wd');
        const source = url.searchParams.get('source') || 'heimuer';

        try {
            const apiUrl = customApi
                ? customApi
                : API_SITES[source].api + '/api.php/provide/vod/?ac=list&wd=' + encodeURIComponent(searchQuery);
            const response = await fetch(apiUrl, {
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    Accept: 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('API 请求失败');
            }
            const data = await response.text();
            return new Response(data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        } catch (error) {
            return new Response(
                JSON.stringify({
                    code: 400,
                    msg: '搜索服务暂时不可用，请稍后再试',
                    list: [],
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                },
            );
        }
    }

    if (url.pathname === '/api/detail') {
        const id = url.searchParams.get('id');
        const source = url.searchParams.get('source') || 'heimuer';
        const customApi = url.searchParams.get('customApi') || '';
        const detailUrl = `https://r.jina.ai/${
            customApi ? customApi : API_SITES[source].detail
        }/index.php/vod/detail/id/${id}.html`;
        const detailUrl2 = `${customApi ? customApi : API_SITES[source].api}/detail/id/${id}.html`;
        console.log(detailUrl2);
        const response = await fetch(detailUrl);
        const html = await response.text();

        // 更新正则表达式以匹配新的 URL 格式
        let matches = [];
        if (source === 'ffzy') {
            matches = html.match(/(?<=\$)(https?:\/\/[^"'\s]+?\/\d{8}\/\d+_[a-f0-9]+\/index\.m3u8)/g) || [];
            matches = matches.map(link => link.split('(')[1]);
        } else {
            matches = html.match(/\$https?:\/\/[^"'\s]+?\.m3u8/g) || [];
            matches = matches.map(link => link.substring(1)); // 移除开头的 $
        }

        return new Response(
            JSON.stringify({
                episodes: matches,
                detailUrl: detailUrl,
            }),
            {
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }

    // 默认返回 HTML 页面
    return new Response(HTML_TEMPLATE, {
        headers: { 'Content-Type': 'text/html' },
    });
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});
