import TerserPlugin from "terser-webpack-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, _) => {
        config.optimization.minimizer = [
            new TerserPlugin({
                terserOptions: {
                    mangle: false,
                },
            }),
        ];
        return config;
    },
};

export default nextConfig;
