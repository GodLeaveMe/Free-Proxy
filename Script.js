function main(params) {
  // 创建代理组的函数
  function createProxyGroup(name, type, icon, proxies) {
    // 设置每个代理组的公共配置
    const commonConfig = {
      url: "http://www.gstatic.com/generate_204", // 用于检测代理是否可用的 URL
      icon, // 代理组的图标
      lazy: true, // 延迟加载
    };

    // 根据代理组类型设置特定配置
    const typeConfig = type === "url-test" ? {
      interval: 300, // URL 测试的间隔时间（秒）
      tolerance: 20, // 容忍度（ms）
      timeout: 2000 // 超时时间（ms）
    } : type === "load-balance" ? {
      strategy: "consistent-hashing" // 负载均衡策略
    } : {};

    // 返回创建的代理组配置
    return {
      name,
      type: type || "url-test", // 默认类型为 url-test
      proxies: proxies.length > 0 ? proxies : ["DIRECT"], // 如果没有指定代理，默认使用 DIRECT
      ...commonConfig,
      ...typeConfig
    };
  }

  // 通过正则表达式获取符合条件的代理
  function getProxiesByRegex(proxies, regex) {
    return proxies.filter(proxy => regex.test(proxy.name)).map(proxy => proxy.name);
  }

  // 定义区域及其正则表达式
  const regions = [
    { name: "HongKong", regex: /香港|HK|Hong|🇭🇰/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Hong_Kong.png",type: "url-test",interval: 150 },
    { name: "TaiWan", regex: /台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Taiwan.png",type: "url-test",interval: 150 },
    { name: "Singapore", regex: /新加坡|狮城|SG|Singapore|🇸🇬/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Singapore.png",type: "url-test",interval: 150 },
    { name: "Japan", regex: /日本|JP|Japan|🇯🇵/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Japan.png",type: "url-test",interval: 150},
    { name: "Korea", regex: /韩国|KO|Korea|🇰🇷/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Korea.png",type: "url-test",interval: 150 },
    { name: "Germany", regex: /德国|DE|Germany|de/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Germany.png",type: "url-test",interval: 150 },
    { name: "America", regex: /美国|US|United States|America|🇺🇸/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_States.png",type: "url-test",interval: 150 },
    { name: "Others", regex: /^(?!.*(?:香港|HK|Hong|🇭🇰|台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼|新加坡|SG|Singapore|狮城|🇸🇬|日本|JP|Japan|🇯🇵|韩国|KO|Korea|ko|德国|DE|Germany|de|美国|US|States|America|🇺🇸|自动|故障|流量|官网|套餐|机场|订阅|年|月)).*$/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/World_Map.png",type: "url-test",interval: 150 },
    { name: "Auto", regex: /^(?!.*(?:自动|故障|流量|官网|套餐|机场|订阅|年|月|失联|频道)).*$/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Auto.png", type: "url-test",interval: 150 },
    { name: "Balance", regex: /^(?!.*(?:自动|故障|流量|官网|套餐|机场|订阅|年|月|失联|频道)).*$/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Available.png", type: "load-balance" },
    { name: "Fallback", regex: /^(?!.*(?:自动|故障|流量|官网|套餐|机场|订阅|年|月|失联|频道)).*$/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Bypass.png", type: "fallback" }
  ];

  // 创建代理组
  const proxyGroups = regions.map(region =>
    createProxyGroup(region.name, region.type, region.icon, getProxiesByRegex(params.proxies, region.regex))
  );

  // 预定义代理组
  const predefinedGroups = [
    { name: "Final", type: "select", proxies: ["DIRECT", "Global", "Proxy"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Final.png" },
    { name: "Proxy", type: "select", proxies: [...new Set(proxyGroups.flatMap(g => g.proxies)),"Auto"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Proxy.png" },
    { name: "Global", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others", "Instagram", "Facebook", "TikTok"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Global.png" },
    { name: "Mainland", type: "select", proxies: ["DIRECT", "Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/China.png" },
    { name: "OpenAI", type: "select", proxies: ["Proxy", "America", "Japan","Korea", "Singapore", "TaiWan",  "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/ChatGPT.png" },
    { name: "ArtIntel", type: "select", proxies: ["Proxy", "America", "Japan","Korea", "Singapore", "TaiWan", "HongKong", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/AI.png" },
    { name: "YouTube", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/YouTube.png" },
    { name: "Instagram", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Instagram.png" },
    { name: "Facebook", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Facebook.png" },
    { name: "TikTok", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/TikTok.png" },
    { name: "X", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Twitter.png" },
    { name: "BiliBili", type: "select", proxies: ["DIRECT", "HongKong", "TaiWan"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/bilibili.png" },
    { name: "Streaming", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others", "Instagram", "Facebook", "TikTok"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/ForeignMedia.png" },
    { name: "Telegram", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Telegram.png" },
    { name: "Google", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Google.png" },
    { name: "Games", type: "select", proxies: ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Game.png" }
  ];

  // 插入分组
  params["proxy-groups"] = [...predefinedGroups, ...proxyGroups];

  const ruleProviders = {
    // Telegram 域名规则集
    telegram_domain: {
      type: 'http',  // 请求类型为 HTTP
      url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.list',  // 规则集 URL
      interval: 86400,  // 更新间隔为 24 小时
      behavior: 'domain',  // 行为类型为域名
      format: 'text'  // 格式为文本
    },
    // Telegram IP 规则集
    telegram_ip: {
      type: 'http',  // 请求类型为 HTTP
      url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.list',  // 规则集 URL
      interval: 86400,  // 更新间隔为 24 小时
      behavior: 'ipcidr',  // 行为类型为 IP CIDR
      format: 'text'  // 格式为文本
    },
    // 广告屏蔽规则集
    ad_block: {
      type: 'http',  // 请求类型为 HTTP
      url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/adguard.list',  // 规则集 URL
      interval: 86400,  // 更新间隔为 24 小时
      behavior: 'domain',  // 行为类型为域名
      format: 'text'  // 格式为文本
    },
    // 广告 IP 规则集
    ad_block_ip: {
      type: 'http',  // 请求类型为 HTTP
      url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/ad.list',  // 规则集 URL
      interval: 86400,  // 更新间隔为 24 小时
      behavior: 'ipcidr',  // 行为类型为 IP CIDR
      format: 'text'  // 格式为文本
    },
    // 广告屏蔽规则集（来自其他源）
    AD: {
      type: 'http',  // 请求类型为 HTTP
      behavior: 'domain',  // 行为类型为域名
      url: "https://raw.githubusercontent.com/earoftoast/clash-rules/main/AD.yaml",  // 规则集 URL
      path: './rules/AD.yaml',  // 保存路径
      interval: 86400  // 更新间隔为 24 小时
    },
    // EasyList 规则集
    EasyList: {
      type: 'http',  // 请求类型为 HTTP
      behavior: 'domain',  // 行为类型为域名
      url: "https://raw.githubusercontent.com/earoftoast/clash-rules/main/EasyList.yaml",  // 规则集 URL
      path: './rules/EasyList.yaml',  // 保存路径
      interval: 86400  // 更新间隔为 24 小时
    },
    // EasyListChina 规则集
    EasyListChina: {
      type: 'http',  // 请求类型为 HTTP
      behavior: 'domain',  // 行为类型为域名
      url: "https://raw.githubusercontent.com/earoftoast/clash-rules/main/EasyListChina.yaml",  // 规则集 URL
      path: './rules/EasyListChina.yaml',  // 保存路径
      interval: 86400  // 更新间隔为 24 小时
    },
    // EasyPrivacy 规则集
    EasyPrivacy: {
      type: 'http',  // 请求类型为 HTTP
      behavior: 'domain',  // 行为类型为域名
      url: "https://raw.githubusercontent.com/earoftoast/clash-rules/main/EasyPrivacy.yaml",  // 规则集 URL
      path: './rules/EasyPrivacy.yaml',  // 保存路径
      interval: 86400  // 更新间隔为 24 小时
    },
    // ProgramAD 规则集
    ProgramAD: {
      type: 'http',  // 请求类型为 HTTP
      behavior: 'domain',  // 行为类型为域名
      url: "https://raw.githubusercontent.com/earoftoast/clash-rules/main/ProgramAD.yaml",  // 规则集 URL
      path: './rules/ProgramAD.yaml',  // 保存路径
      interval: 86400  // 更新间隔为 24 小时
    },
    //广告屏蔽规则集
    category_ads_all: {
      type: 'http',  // 请求类型为 HTTP
      behavior: 'domain',  // 行为类型为域名
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ads-all.yaml",  // 规则集 URL
      path: './rules/category-ads-all.yaml',  // 保存路径
      interval: 86400  // 更新间隔为 24 小时
    },
  //广告屏蔽规则集
    BanAD: {
      type: 'http',  // 请求类型为 HTTP
      url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/BanAD.list",  // 规则集 URL
      interval: 86400,  // 更新间隔为 24 小时
      behavior: 'domain',  // 行为类型为域名
      format: 'text'  // 格式为文本
    }
  };
  
  params["rule-providers"] = ruleProviders;  // 将规则提供者配置添加到参数中
  
  
    
  params.rules = [

    // 广告屏蔽规则
    "RULE-SET,ad_block,REJECT",  // 屏蔽广告域名的流量，使用广告屏蔽规则集
    "RULE-SET,ad_block_ip,REJECT",  // 屏蔽广告IP的流量，使用广告IP屏蔽规则集
    
    // 屏蔽常见的广告域名
    "DOMAIN-SUFFIX,ads.com,REJECT",  // 屏蔽所有以 ads.com 结尾的域名
    "DOMAIN-SUFFIX,adserver.com,REJECT",  // 屏蔽所有以 adserver.com 结尾的域名
    "DOMAIN-SUFFIX,track.com,REJECT",  // 屏蔽所有以 track.com 结尾的域名
    "DOMAIN-SUFFIX,advertising.com,REJECT",  // 屏蔽所有以 advertising.com 结尾的域名
    "DOMAIN-SUFFIX,ad.doubleclick.net,REJECT",  // 屏蔽 Google DoubleClick 广告
    "DOMAIN-SUFFIX,adclick.com,REJECT",  // 屏蔽所有以 adclick.com 结尾的广告域名
    "DOMAIN-SUFFIX,adnxs.com,REJECT",  // 屏蔽 AppNexus 广告网络
    "DOMAIN-SUFFIX,media.net,REJECT",  // 屏蔽 Media.net 广告网络
    "DOMAIN-SUFFIX,ad.serve.com,REJECT",  // 屏蔽所有以 ad.serve.com 结尾的广告域名

    // 引入已定义的广告规则集
    "RULE-SET,AD,REJECT",
    "RULE-SET,EasyList,REJECT",
    "RULE-SET,EasyListChina,REJECT",
    "RULE-SET,EasyPrivacy,REJECT",
    "RULE-SET,ProgramAD,REJECT",
    "RULE-SET,category_ads_all,REJECT",
    "RULE-SET,BanAD,REJECT",

    // 屏蔽特定广告服务的流量
    "DOMAIN,facebook.com,REJECT",  // 屏蔽 facebook.com 域名
    "DOMAIN,t.co,REJECT",  // 屏蔽 t.co 域名
    "DOMAIN,ads.twitter.com,REJECT",  // 屏蔽 ads.twitter.com 域名
  
    // 特定站点流量处理规则
    "GEOSITE,Bing,ArtIntel",  // 将流量指向 Bing（微软搜索引擎）的站点通过 ArtIntel 策略处理
    "GEOSITE,openai,OpenAI",  // 将流量指向 OpenAI 相关站点（如 ChatGPT）通过 OpenAI 策略处理
  
    // 流量指向的中国大陆网站处理策略
    "GEOSITE,Bilibili,BiliBili",  // 将 Bilibili（中国视频分享网站）的流量通过 BiliBili 策略处理
    "GEOSITE,Category-games@cn,Mainland",  // 将中国大陆的游戏类别网站流量通过 Mainland 策略处理
  
    // 流量指向的国际网站处理策略
    "GEOSITE,Youtube,YouTube",  // 将 YouTube 网站流量通过 YouTube 策略处理
    "GEOSITE,Disney,Streaming",  // 将 Disney 相关流量（如 Disney+）通过 Streaming 策略处理
    "GEOSITE,Netflix,Streaming",  // 将 Netflix 流量通过 Streaming 策略处理
    "GEOSITE,HBO,Streaming",  // 将 HBO 流量（如 HBO Max）通过 Streaming 策略处理
    "GEOSITE,Primevideo,Streaming",  // 将 Amazon Prime Video 流量通过 Streaming 策略处理
    "GEOSITE,Google,Google",  // 将 Google 相关网站流量通过 Google 策略处理
    "GEOSITE,Instagram,Instagram",  // 将 Instagram 相关网站流量通过 Instagram 策略处理
    "GEOSITE,Facebook,Facebook",  // 将 Facebook 相关网站流量通过 Facebook 策略处理
    "GEOSITE,TikTok,TikTok",  // 将 TikTok 相关网站流量通过 TikTok 策略处理
    "GEOSITE,Twitter,X",  // 将 X（Twitter）相关网站流量通过 X 策略处理
    "GEOSITE,Github,Global",  // 将 GitHub 网站流量通过 Global 策略处理
  
    // 流量处理策略根据 IP 地址
    "GEOIP,Telegram,Telegram,no-resolve",  // 将 Telegram 的流量通过 Telegram 策略处理，不解析域名（直接使用 IP）
    "RULE-SET,telegram_domain,Telegram",  // 将 Telegram 的域名流量通过 Telegram 策略处理
    "RULE-SET,telegram_ip,Telegram",  // 将 Telegram 的 IP 流量通过 Telegram 策略处理
  
    // 处理中国大陆和国际范围内的地理位置流量
    "GEOSITE,Microsoft@cn,Mainland",  // 将中国大陆的 Microsoft 相关网站流量通过 Mainland 策略处理
    "GEOSITE,Apple@cn,Mainland",  // 将中国大陆的 Apple 相关网站流量通过 Mainland 策略处理
    "GEOSITE,Geolocation-!cn,Global",  // 将非中国大陆的地理位置相关网站流量通过 Global 策略处理
    "GEOSITE,CN,Mainland",  // 将中国大陆的网站流量通过 Mainland 策略处理
    "GEOIP,CN,Mainland,no-resolve",  // 将中国大陆的 IP 地址流量通过 Mainland 策略处理，不解析域名（直接使用 IP）
  
    // 根据目标端口、网络协议和地理位置来拒绝流量
    // 拒绝所有 UDP 协议、目标端口为 443 且地理位置不在中国大陆的流量
    "AND,(AND,(DST-PORT,443),(NETWORK,UDP)),(NOT,((GEOIP,CN,no-resolve))),REJECT",
  
    // 默认匹配规则
    "MATCH,Final"  // 处理所有剩余的流量，通常作为默认策略
  ];
    
 

  /***
   *** 使用远程规则资源示例
   *** 使用时须在rules中添加对应规则
   *** 例如
       "RULE-SET,telegram_domain,Telegram",
       "RULE-SET,telegram_ip,Telegram,no-resolve"
   */
  /***
  // 远程规则类型
  const ruleAnchor = {
    ip: { type: 'http', interval: 86400, behavior: 'ipcidr', format: 'text' },
    domain: { type: 'http', interval: 86400, behavior: 'domain', format: 'text' }
  };
  // 远程规则资源
  const ruleProviders = {
    telegram_domain: { ...ruleAnchor.domain, url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.list' },
    telegram_ip: { ...ruleAnchor.ip, url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.list' }
  };
  // 插入远程规则
  params["rule-providers"] = ruleProviders;
   */

  return params;
}
