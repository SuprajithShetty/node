(function(){

  self.addEventListener('install',event =>{
      console.log('service worker installing');
      // loading static html into cache first
      event.waitUntil(
          caches
            .open('PWD_app')
            .then(cache =>
              cache.addAll([
                '/git'
              ])
            )
        )
      self.skipWaiting();
  })

  self.addEventListener('activate',event=>{
      event.waitUntil(caches.delete('PWD_app'));
      console.log('service worker activating...')
  })

  self.addEventListener('fetch',event=>{
      console.log('fetching',event.request.url);
      event.respondWith(
          caches.match(event.request).then(async (response) => {
            if (response) {
              //found an entry in the cache!
              return response
            }
          
          let data = fetch(event.request);
          let data_clone = (await data).clone();
          event.waitUntil(caches.open('PWD_app').then(cache => cache.put(event.request, data_clone)));
          
          return data


            
          })
        )
  })
})

()
