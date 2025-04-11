/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.alias['electron'] = false; // Ignore 'electron' module
        return config;
    },
    images: {
        domains: ['gateway.pinata.cloud'],
    },
};

export default nextConfig;
