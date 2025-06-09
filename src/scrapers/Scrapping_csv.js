const allContent = []

function createCSV(data, fileName) {
  const headers = ['type', 'content', 'author']

  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          if (value === null) return 'null'
          if (typeof value === 'string') {
            // Wrap all fields, including those without commas, in double quotes
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(','),
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, fileName)
  } else {
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', fileName || 'data.csv')
    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

// Email extraction function removed - not needed for simplified scraper

function clickOnComments(post) {
  // Get all divs on the page
  var allDivs = post.getElementsByTagName('div')

  // Create an array to store matching divs
  var matchingDivs = []

  // Loop through each div
  for (var i = 0; i < allDivs.length; i++) {
    // Check if the div has the attribute data-visualcompletion set to "ignore-dynamic"
    if (allDivs[i].getAttribute('data-visualcompletion') === 'ignore-dynamic') {
      // Add the matching div to the array
      matchingDivs.push(allDivs[i])
      const thingToClickToOpenComments =
        allDivs?.[i]?.children?.[0]?.children?.[0]?.children?.[0]?.children?.[0]
          ?.children?.[0]?.children?.[1]?.children?.[1]?.children?.[0]
          ?.children?.[0]
      if (thingToClickToOpenComments) {
        thingToClickToOpenComments.click()
      }
    }
  }
}

function clickSeeMore(post) {
  // Buscar botones "Ver más" en múltiples idiomas y formatos
  const seeMoreSelectors = [
    '*[aria-label*="Ver más"]',
    '*[aria-label*="See more"]',
    '*[aria-label*="Show more"]',
    'div[role="button"]:contains("Ver más")',
    'div[role="button"]:contains("See more")',
    'span:contains("Ver más")',
    'span:contains("See more")',
    'div:contains("Ver más")',
    'div:contains("See more")'
  ]
  
  // Función personalizada para buscar por texto
  function findElementByText(element, text) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    )
    
    let node
    while (node = walker.nextNode()) {
      if (node.textContent.trim().toLowerCase().includes(text.toLowerCase())) {
        return node.parentElement
      }
    }
    return null
  }
  
  try {
    // Buscar por texto "Ver más" o "See more"
    const seeMoreTexts = ['Ver más', 'See more', 'Show more', 'Más']
    
    for (const text of seeMoreTexts) {
      const element = findElementByText(post, text)
      if (element && element.click) {
        console.log(`Clicking "${text}" button`)
        element.click()
        return true
      }
    }
    
    // Buscar por selectores CSS
    for (const selector of seeMoreSelectors) {
      try {
        const elements = post.querySelectorAll(selector)
        for (const element of elements) {
          if (element.click && element.offsetParent !== null) { // Verificar que sea visible
            console.log(`Clicking see more with selector: ${selector}`)
            element.click()
            return true
          }
        }
      } catch (e) {
        // Continuar si el selector falla
        continue
      }
    }
    
    // Buscar por atributos específicos de Facebook
    const fbSeeMoreElements = post.querySelectorAll('div[role="button"]')
    for (const element of fbSeeMoreElements) {
      const text = element.textContent || element.innerText || ''
      if (text.toLowerCase().includes('ver más') || 
          text.toLowerCase().includes('see more') ||
          text.toLowerCase().includes('show more')) {
        console.log('Clicking Facebook see more button')
        element.click()
        return true
      }
    }
    
  } catch (error) {
    console.log('Error clicking see more:', error)
  }
  
  return false
}

// HTML text traversal function removed - not needed for simplified scraper

function getAllPosts() {
  const posts = document.querySelectorAll('div[role=feed] > div')
  return [...posts].filter((post) => {
    const posterName = post?.querySelector('h2')?.textContent || post?.querySelector('h3')?.textContent
    if (posterName) {
      return true
    }
    return false
  })
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function closeDialog() {
  const closeButton = document?.querySelector('div[aria-label="Close"]')
  if (!closeButton) {
    return
  }
  closeButton.click()
}

function formatTopLevelComments(postId, topLevelComments = []) {
  return topLevelComments.map((c) => {
    const text = c?.comment.body.text
    const authorName = c?.comment.author.name
    return {
      type: 'comment',
      content: text || '',
      author: authorName || 'Unknown'
    }
  })
}

function parseFirstLevelJson(json) {
  const actor =
    json?.data?.node?.group_feed?.edges?.[0]?.node?.comet_sections
      ?.context_layout?.story?.comet_sections?.actor_photo?.story?.actors?.[0]

  const postText =
    json?.data?.node?.group_feed?.edges?.[0]?.node?.comet_sections?.content
      ?.story?.comet_sections?.message_container?.story?.message?.text

  const post = {
    type: 'post',
    content: postText || '',
    author: actor?.name || 'Unknown'
  }

  const topLevelComments = formatTopLevelComments(
    null,
    json?.data?.node?.group_feed?.edges?.[0]?.node?.comet_sections?.feedback
      ?.story?.feedback_context?.interesting_top_level_comments,
  )
  return {
    post,
    topLevelComments,
  }
}

function parseSecondLevelJson(json) {
  const actor =
    json?.data?.node?.comet_sections?.content?.story?.comet_sections
      ?.context_layout?.story?.comet_sections?.actor_photo?.story?.actors?.[0]

  const postText =
    json?.data?.node?.comet_sections?.content?.story?.comet_sections
      ?.message_container?.story?.message?.text

  const post = {
    type: 'post',
    content: postText || '',
    author: actor?.name || 'Unknown'
  }

  const topLevelComments = formatTopLevelComments(
    null,
    json?.data?.node?.comet_sections?.feedback?.story?.feedback_context
      ?.interesting_top_level_comments,
  )

  return {
    post,
    topLevelComments,
  }
}

function parseThirdLevelJson(json) {
  const actor =
    json?.data?.node?.comet_sections?.content?.story?.comet_sections
      ?.context_layout?.story?.comet_sections?.actor_photo?.story?.actors?.[0]
  
  const postText =
    json?.data?.node?.comet_sections?.content?.story?.comet_sections
      ?.message_container?.story?.message?.text

  const post = {
    type: 'post',
    content: postText || '',
    author: actor?.name || 'Unknown'
  }

  const topLevelComments = formatTopLevelComments(
    null,
    json?.data?.node?.comet_sections?.feedback?.story?.feedback_context
      ?.interesting_top_level_comments,
  )

  return {
    post,
    topLevelComments,
  }
}

function addCommentsToAllContent(comments = []) {
  comments.forEach((c) => {
    if (!allContent?.find((f) => f.content === c.content && f.author === c.author)) {
      allContent.push(c)
    }
  })
}

function interceptRequests() {
  let oldXHROpen = window.XMLHttpRequest.prototype.open
  window.XMLHttpRequest.prototype.open = function (method, url, async) {
    if (!url.includes('graphql')) {
      return oldXHROpen.apply(this, arguments)
    }
    // Capture the request body
    let requestBody = null

    // Override the send method to capture the request body
    let oldXHRSend = this.send
    this.send = function (data) {
      requestBody = data
      oldXHRSend.apply(this, arguments)
    }

    // Listen for the 'load' event to capture the response
    this.addEventListener('load', function () {
      if (
        requestBody?.includes('GroupsCometFeedRegularStoriesPaginationQuery')
      ) {
        console.log('getting posts')
        // we're getting posts....
        const payload = this.responseText
        const lines = payload.split('\n')

        const data1 = JSON.parse(lines[0])
        const firstPost = parseFirstLevelJson(data1)
        console.log('firstPost', firstPost)

        const data2 = JSON.parse(lines[1])
        const secondPost = parseSecondLevelJson(data2)
        console.log('secondPost', secondPost)

        const data3 = JSON.parse(lines[2])
        const thirdPost = parseThirdLevelJson(data3)
        console.log('thirdPost', thirdPost)

        allContent.push(firstPost.post)
        addCommentsToAllContent(firstPost.topLevelComments)
        allContent.push(secondPost.post)
        addCommentsToAllContent(secondPost.topLevelComments)
        allContent.push(thirdPost.post)
        addCommentsToAllContent(thirdPost.topLevelComments)
      } else if (requestBody?.includes('CometFocusedStoryViewUFIQuery')) {
        console.log('getting comments')
        let data = null
        try {
          data = JSON.parse(this.responseText)
        } catch (e) {}
        
        const comments =
          data?.data?.feedback?.ufi_renderer?.feedback?.comment_list_renderer?.feedback?.comment_rendering_instance_for_feed_location?.comments?.edges?.map(
            (blah) => {
              const comment = blah?.node
              const commentText = comment?.body?.text
              const authorName = comment?.author?.name

              return {
                type: 'comment',
                content: commentText || '',
                author: authorName || 'Unknown'
              }
            },
          ) || []
        addCommentsToAllContent(comments)
        console.log('comments', comments)
      } else {
        return
      }
    })

    // Call the original open method
    return oldXHROpen.apply(this, arguments)
  }
}

async function run() {
  interceptRequests()
  console.log('starting...')
  let posts = getAllPosts()
  console.log('posts.length', posts.length)
  let i = 0

  while (i < posts.length) {
    const post = posts[i]
    console.log(
      `Processing post ${i + 1}/${posts.length}`,
    )
    
    // Primero intentar hacer clic en "Ver más" para expandir el contenido
    clickSeeMore(post)
    await sleep(500) // Esperar un poco para que se expanda el contenido
    
    // Luego hacer clic en comentarios
    clickOnComments(post)
    await sleep(1000)
    closeDialog()

    i++
  }

  createCSV(allContent, 'facebookGroupPostsAndComments.csv')
  console.log('allContent', allContent)
  console.log('done!')
  console.log(
    `Congrats! 🎉 You scraped a sh*t ton of posts!`,
  )
}

// Run the scraper without scrolling
await run()