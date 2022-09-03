---
layout     : post
title      : "Recursion 😵‍💫"
date       : 2022-09-03
categories : RMIT CCS
---

<iframe  id='recursion'></iframe>

<script>
    const recursion_frame = document.getElementById ('recursion')
    console.dir (recursion_frame)
    recursion_frame.width = recursion_frame.parentNode.scrollWidth
    recursion_frame.height = recursion_frame.width
    const i = !location.search ? 1 :
      Number (location.search.split ("?").pop ()) + 1
    if (i < 12) {
        const path = `/rmit/ccs/2022/09/03/recursion.html?${ i }`
        recursion_frame.src = `http://thomas.capogre.co` + path
    }
    else {
        recursion_frame.src = ''
    }
</script>

```html
<iframe  id='recursion'></iframe>

<script>
    const recursion_frame = document.getElementById ('recursion')
    console.dir (recursion_frame)
    recursion_frame.width = recursion_frame.parentNode.scrollWidth
    recursion_frame.height = recursion_frame.width
    const i = !location.search ? 1 :
      Number (location.search.split ("?").pop ()) + 1
    if (i < 12) {
        const path = `/rmit/ccs/2022/09/03/recursion.html?${ i }`
        recursion_frame.src = `http://thomas.capogre.co` + path
    }
</script>
```