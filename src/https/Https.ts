import https from 'https';

export function makeHttpPostRequest(): Promise<string> {
    const options: https.RequestOptions = {
        protocol: 'https:',
        hostname: 'anhthuanhtu.com',
        port: 443,
        method: 'POST',
        path: '/post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic TOKEN',
        },
    };

    const postBody = {
        req: 'Post body',
    };

    return new Promise<string>((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                console.log(body);

                if (res.statusCode && res.statusCode / 2 === 100) {
                    console.log('success');
                    resolve('Success');
                } else {
                    console.log('failed');
                    resolve('Failure');
                }
            });

            res.on('error', (error) => {
                console.log('error:', error);
                reject(Error('HTTP call failed'));
            });
        });

        req.write(JSON.stringify(postBody));
        req.end();
    });
}
