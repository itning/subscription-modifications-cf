export function handle(config: any): any {
    const proxies = config['proxies'] ?? [];
    const blackProxiesNames = ['時間', '續約', '負載群集'];
    const proxiesNames = proxies
        .map((item: { name: any; }) => item.name)
        .filter((item: string | string[]) => !blackProxiesNames.some(word => item.includes(word)));
    const commonProxyGroupsConfig = {
        // 健康检查测试地址
        url: 'https://www.gstatic.com/generate_204',
        // 健康检查间隔，如不为 0 则启用定时测试，单位为秒
        interval: 60 * 10,
        // 懒惰状态，默认为true,未选择到当前策略组时，不进行测试
        lazy: true,
        // 健康检查超时时间，单位为毫秒
        timeout: 5000,
        // 最大失败次数，超过则触发一次强制健康检查，默认 5
        'max-failed-times': 5
    };
    const proxyGroups = [
        {
            name: "线路选择",
            type: "select",
            proxies: proxiesNames,
            // https://www.clashverge.dev/guide/group_icon/group_icon.html
            icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg',
            ...commonProxyGroupsConfig
        },
        {
            name: "其他网域",
            type: "select",
            proxies: ["线路选择", "DIRECT"],
            icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg',
            ...commonProxyGroupsConfig
        },
    ];
    const rules = [
		'DOMAIN-SUFFIX,ottdns.com,DIRECT',
        'DOMAIN-SUFFIX,cn,DIRECT',
        'GEOSITE,CN,DIRECT',
        'GEOIP,CN,DIRECT,no-resolve',
        'MATCH,其他网域'
    ];

    config['dns'] = {
        "use-system-hosts": true
    };
    config['proxy-groups'] = proxyGroups;
    config['rules'] = rules;
    return config;
}
