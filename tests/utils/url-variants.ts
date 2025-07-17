/**
 * Generic helper function to generate URL variants for any platform
 * Generates all possible combinations of protocols, www, query params, hash fragments, etc.
 */
export function generateUrlVariants(
    domains: string[],
    pathname: string,
    options: {
        locales?: string[]
        queryParams?: string[]
        hashFragments?: string[]
    } = {}
) {
    const {
        locales = ['us', 'fr'],
        queryParams = [
            'utm_source=twitter&fbclid=abc123',
            'utm_medium=social&ref=share'
        ],
        hashFragments = ['section-reviews', 'comments']
    } = options

    const variants: Record<string, string> = {}
    const allUrls: string[] = []

    // Protocol variants - always generate all
    const protocols = ['https://', 'http://', '']
    
    // WWW variants - always generate all
    const wwwVariants = ['www.', '']
    
    // Trailing slash variants - always generate all
    const trailingSlashVariants = ['/', '']

    // Nested loops for all combinations
    domains.forEach((domain, domainIndex) => {
        locales.forEach((locale, localeIndex) => {
            const path = pathname.replace('{locale}', locale)
            const baseUrl = `${domain}/${path}`
            
            protocols.forEach((protocol, protocolIndex) => {
                wwwVariants.forEach((www, wwwIndex) => {
                    trailingSlashVariants.forEach((trailingSlash, trailingIndex) => {
                        // Base URL without query/hash
                        const fullUrl = `${protocol}${www}${baseUrl}${trailingSlash}`
                        const cleanUrl = fullUrl.replace(/\/$/, '') // Remove trailing slash for key generation
                        
                        // Generate key for base variants
                        const domainSuffix = domainIndex > 0 ? `_d${domainIndex}` : ''
                        const localeSuffix = localeIndex > 0 ? `_${locale.toUpperCase()}` : ''
                        const protocolSuffix = protocolIndex === 0 ? '_https' : protocolIndex === 1 ? '_http' : '_plain'
                        const wwwSuffix = wwwIndex === 0 ? '_www' : ''
                        const trailingSuffix = trailingIndex === 0 ? '_slash' : ''
                        
                        const baseKey = `base${domainSuffix}${localeSuffix}${protocolSuffix}${wwwSuffix}${trailingSuffix}`
                        
                        variants[baseKey] = fullUrl
                        allUrls.push(fullUrl)
                        
                        // Query parameter variants
                        queryParams.forEach((query, queryIndex) => {
                            const queryUrl = `${cleanUrl}?${query}`
                            const queryKey = `query${queryIndex + 1}${domainSuffix}${localeSuffix}${protocolSuffix}${wwwSuffix}${trailingSuffix}`
                            
                            variants[queryKey] = queryUrl
                            allUrls.push(queryUrl)
                            
                            // Hash fragment variants with query
                            hashFragments.forEach((hash, hashIndex) => {
                                const queryHashUrl = `${queryUrl}#${hash}`
                                const queryHashKey = `queryHash${queryIndex + 1}_${hashIndex + 1}${domainSuffix}${localeSuffix}${protocolSuffix}${wwwSuffix}${trailingSuffix}`
                                
                                variants[queryHashKey] = queryHashUrl
                                allUrls.push(queryHashUrl)
                            })
                        })
                        
                        // Hash fragment variants without query
                        hashFragments.forEach((hash, hashIndex) => {
                            const hashUrl = `${cleanUrl}#${hash}`
                            const hashKey = `hash${hashIndex + 1}${domainSuffix}${localeSuffix}${protocolSuffix}${wwwSuffix}${trailingSuffix}`
                            
                            variants[hashKey] = hashUrl
                            allUrls.push(hashUrl)
                        })
                    })
                })
            })
        })
    })

    // Add some cleaner named variants for common cases
    if (variants.base_https) {
        variants.https = variants.base_https
    }
    if (variants.base_http) {
        variants.http = variants.base_http  
    }
    if (variants.base_plain) {
        variants.base = variants.base_plain
    }
    if (variants.base_https_www) {
        variants.wwwHttps = variants.base_https_www
    }
    if (variants.base_http_www) {
        variants.wwwHttp = variants.base_http_www
    }
    if (variants.base_plain_www) {
        variants.www = variants.base_plain_www
    }

    return {
        variants,
        allUrls: [...new Set(allUrls)] // Remove duplicates
    }
} 