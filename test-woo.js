import('dotenv/config').then(() => {
    import('./src/data/tours.ts').then(m => {
        m.getAllTours().then(tours => {
            console.log(JSON.stringify(tours.find(t => t.id === 'atv'), null, 2));
        });
    });
});
