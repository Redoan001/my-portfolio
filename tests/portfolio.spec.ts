import { expect, test, type Page, type Route } from '@playwright/test'

const submissionEndpoint = 'https://api.web3forms.com/submit'
const sample = {
  name: 'Portfolio Test Visitor',
  email: 'visitor@example.com',
  phone: '+8801700000000',
  message: 'I would like to discuss a motion graphics project.',
}
const successCopy =
  'Thanks! I have received your query and will get back to you as soon as possible. Looking forward to connecting with you!'

// Preserved from the original portfolio, including its URL query parameters.
const originalVideoUrls = [
  'https://youtube.com/embed/TqOHsgI6kVo?si=0NU_fbL4qA4xc6GO',
  'https://youtube.com/embed/JpMmFwRRDV4?feature=share',
  'https://youtube.com/embed/YftsxbEUmjw?si=kb-1u3ZMoK1mnZEH',
  'https://youtube.com/embed/y68M4Xbpc-I?si=_EgvjRocoyKEv_BD',
  'https://www.youtube.com/embed/8U76P5Y5Amg',
  'https://youtube.com/embed/OZDyN01Igh0?feature=share',
  'https://youtube.com/embed/6uinajX1Fzw?si=SWihlCqRV2uDjqIX',
  'https://youtube.com/embed/uI29nBFaZdo?si=vRpDm3RWx2AfdQZj',
  'https://youtube.com/embed/-uCXnvq-urc?si=ytxr0wZhfUzkJ75Y',
  'https://youtube.com/embed/EpcOkuLJFTQ?si=Bpior02yE6r9n_6p',
  'https://youtube.com/embed/kgTHn_uHD9I?feature=share',
  'https://youtube.com/embed/JpfIdg7ZMzI?si=J4CGvUrLcFqnlZ-j',
  'https://www.youtube.com/embed/n0LK9XV0oOk?si=OoHJmxiSYETYN-wh',
  'https://www.youtube.com/embed/sZwXZF3l9a4?si=DZIJG2xHzRn_hh0m',
  'https://www.youtube.com/embed/sUUoQXXHCBA?si=iSPAm_cqle2l7KMM',
  'https://www.youtube.com/embed/fe44qk2VWY8?si=J76CMPcRt14Wt-he',
]

test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/(?:www\.)?youtube\.com\/embed\//, (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Video preview</title>' }),
  )
  // Every submission is intercepted, including submissions from a failing test.
  await page.route(submissionEndpoint, (route) => route.abort('blockedbyclient'))
})

async function fillContactForm(page: Page) {
  await page.getByLabel('Name*', { exact: true }).fill(sample.name)
  await page.getByLabel('Email Address*', { exact: true }).fill(sample.email)
  await page.getByLabel('Phone Number*', { exact: true }).fill(sample.phone)
  await page.getByLabel('Leave Your Message*', { exact: true }).fill(sample.message)
}

async function expectRetainedInputs(page: Page) {
  await expect(page.getByLabel('Name*', { exact: true })).toHaveValue(sample.name)
  await expect(page.getByLabel('Email Address*', { exact: true })).toHaveValue(sample.email)
  await expect(page.getByLabel('Phone Number*', { exact: true })).toHaveValue(sample.phone)
  await expect(page.getByLabel('Leave Your Message*', { exact: true })).toHaveValue(sample.message)
  await expect(page.getByRole('button', { name: 'Submit', exact: true })).toBeEnabled()
  await expect(page.locator('#success-message')).not.toContainText(successCopy)
}

test('retains the original videos, typography, colors, and desktop grids', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page).toHaveTitle('Md. Redoan | Expert video editor & motion graphic designer')
  await expect(page.locator('.portfolio-item iframe')).toHaveCount(16)
  expect(await page.locator('.portfolio-item iframe').evaluateAll((frames) =>
    frames.map((frame) => frame.getAttribute('src')),
  )).toEqual(originalVideoUrls)
  await expect(page.locator('body')).toHaveCSS('font-family', 'Inter, sans-serif')
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(0, 0, 0)')
  await expect(page.locator('body')).toHaveCSS('color', 'rgb(255, 255, 255)')
  await expect(page.locator('.hero-content h1').first()).toHaveCSS('font-size', '72px')
  await expect(page.locator('.hero-content h1').first()).toHaveCSS('font-weight', '800')
  await expect(page.locator('.hero-content p')).toHaveCSS('color', 'rgb(169, 169, 179)')
  await expect(page.locator('#typewriter')).toHaveCSS('color', 'rgb(255, 76, 49)')
  await expect(page.locator('.nav-links a').first()).toHaveCSS('font-size', '17.6px')
  await expect(page.locator('.section-header h2').first()).toHaveCSS('font-size', '48px')
  await expect(page.locator('.btn-submit')).toHaveCSS('background-color', 'rgb(255, 76, 49)')
  for (const [selector, columns] of [
    ['.expert-grid', 4], ['.grid-reels', 3], ['.grid-ads', 3], ['.grid-promo', 2], ['.contact-grid', 2],
  ] as const) {
    const grid = page.locator(selector)
    await expect(grid).toHaveCSS('display', 'grid')
    expect(await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(columns)
  }
  await expect(page.locator('footer')).toContainText(`${new Date().getFullYear()} MD Redoan | All Rights Reserved`)
  expect(errors).toEqual([])
})

test('mobile navigation opens and closes after choosing a section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const menu = page.locator('#hamburger')
  await expect(menu).toBeVisible()
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
  await menu.click()
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('#nav-links')).toBeInViewport()
  await page.locator('#nav-links').getByRole('link', { name: 'CONTACT', exact: true }).click()
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
  await expect(page).toHaveURL(/#contact-me$/)
  await expect(page.locator('#nav-links')).not.toBeInViewport()
})

test('mobile portfolio controls advance and reverse every category', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  for (const [category, selector] of [
    ['Reels', '.grid-reels'], ['Social Media Ads', '.grid-ads'], ['Promotional Video', '.grid-promo'],
  ] as const) {
    const track = page.locator(selector)
    await expect(track).toHaveCSS('display', 'flex')
    const initialPosition = await track.evaluate((element) => element.scrollLeft)
    await page.getByRole('button', { name: `Next ${category}`, exact: true }).click()
    await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(initialPosition + 100)
    await page.getByRole('button', { name: `Previous ${category}`, exact: true }).click()
    await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeLessThan(20)
  }
})

test('resizing across original breakpoints switches navigation and carousel layouts', async ({ page }) => {
  await page.goto('/')
  for (const width of [767, 768, 900, 901, 767]) {
    await page.setViewportSize({ width, height: 1000 })
    const isCarousel = width < 768
    for (const selector of ['.grid-reels', '.grid-ads', '.grid-promo']) {
      await expect(page.locator(selector)).toHaveCSS('display', isCarousel ? 'flex' : 'grid')
    }
    await expect(page.locator('#hamburger')).toHaveCSS('display', width <= 900 ? 'flex' : 'none')
    if (isCarousel) {
      await expect(page.getByRole('button', { name: 'Next Reels', exact: true })).toBeVisible()
    } else {
      await expect(page.getByRole('button', { name: 'Next Reels', exact: true })).toBeHidden()
      const columns = await page.locator('.grid-reels').evaluate((element) =>
        getComputedStyle(element).gridTemplateColumns.split(' ').length,
      )
      expect(columns).toBe(width <= 900 ? 1 : 3)
    }
  }
})

test('typewriter types the name, deletes it, and repeats', async ({ page }) => {
  test.setTimeout(45_000)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') })
  await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'))
  await page.goto('/')
  const samples: string[] = []
  for (let step = 0; step < 65; step += 1) {
    await page.clock.runFor(200)
    samples.push(await page.locator('#typewriter').innerText())
  }
  const firstFullName = samples.indexOf('MD. REDOAN')
  expect(firstFullName).toBeGreaterThanOrEqual(0)
  const clearedAfterName = samples.findIndex((text, index) => index > firstFullName && text === '')
  expect(clearedAfterName).toBeGreaterThan(firstFullName)
  expect(samples.slice(clearedAfterName + 1)).toContain('MD. REDOAN')
})

test('back-to-top appears beyond 400px and returns to the hero', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  const backToTop = page.locator('#backToTop')
  await expect(backToTop).toBeHidden()
  await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }))
  await expect(backToTop).toBeHidden()
  await page.evaluate(() => window.scrollTo({ top: 401, behavior: 'instant' }))
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(401)
  await expect(backToTop).toBeVisible()
  // Exercise the click away from the boundary after checking the exact threshold.
  await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }))
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(600)
  await backToTop.click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  await expect(backToTop).toBeHidden()
})

test('contact form preserves its fields and uses native required validation', async ({ page }) => {
  let submissions = 0
  page.on('request', (request) => { if (request.url() === submissionEndpoint) submissions += 1 })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Provide me with the details' })).toBeVisible()
  await expect(page.locator('input[name="botcheck"]')).toBeHidden()
  for (const [label, placeholder] of [
    ['Name*', 'Your Full Name'],
    ['Email Address*', 'Your Email Address'],
    ['Phone Number*', 'Your Phone Number'],
    ['Leave Your Message*', 'What Would You Like To Discuss?'],
  ]) {
    const field = page.getByLabel(label, { exact: true })
    await expect(field).toHaveAttribute('placeholder', placeholder)
    await expect(field).toHaveAttribute('required', '')
  }
  await page.getByRole('button', { name: 'Submit', exact: true }).click()
  await expect(page.getByLabel('Name*', { exact: true })).toBeFocused()
  expect(submissions).toBe(0)
  await fillContactForm(page)
  const email = page.getByLabel('Email Address*', { exact: true })
  await email.fill('invalid-email')
  await page.getByRole('button', { name: 'Submit', exact: true }).click()
  await expect(email).toBeFocused()
  expect(await email.evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true)
  expect(submissions).toBe(0)
})

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 600 },
  { width: 768, height: 600 },
]) {
  test(`normal-motion scroll reveals every staged group at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    const firstPortfolioGroup = page.locator('#portfolio .carousel-wrap').first()
    await expect(firstPortfolioGroup).toHaveCSS('opacity', '0')
    const revealTargets = page.locator('.reveal')
    for (const target of await revealTargets.all()) {
      await target.evaluate((element) => {
        window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top - 150, behavior: 'instant' })
      })
      await expect(target).toHaveCSS('opacity', '1')
    }
    // Each portfolio group reveals at its own scroll position, including the tall 768px layout.
    await expect(firstPortfolioGroup).toHaveCSS('opacity', '1')
  })
}

test('normal-motion clicks create a ring and twenty particles that clean up', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') })
  await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'))
  await page.goto('/')
  await page.clock.runFor(100)
  await page.mouse.click(20, 350)
  await expect(page.locator('.click-ripple')).toHaveCount(1)
  await expect(page.locator('.click-particle')).toHaveCount(20)
  await expect(page.locator('.click-ripple')).toHaveCSS('pointer-events', 'none')
  await expect(page.locator('.click-particle').first()).toHaveCSS('pointer-events', 'none')
  await page.clock.runFor(1000)
  await expect(page.locator('.click-ripple, .click-particle')).toHaveCount(0)
})

test('normal-motion hover and focus preserve button glow, card lift, and input glow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  const button = page.locator('nav .btn-hire')
  await button.hover()
  await expect.poll(() => button.evaluate((element) =>
    new DOMMatrixReadOnly(getComputedStyle(element).transform).a,
  )).toBeGreaterThan(1.07)
  await expect(button).toHaveCSS('box-shadow', /255, 76, 49/)
  await page.mouse.move(0, 0)
  await expect.poll(() => button.evaluate((element) =>
    new DOMMatrixReadOnly(getComputedStyle(element).transform).a,
  )).toBeCloseTo(1, 2)

  await page.locator('#services .section-header').evaluate((element) =>
    element.scrollIntoView({ block: 'center', behavior: 'instant' }),
  )
  await expect(page.locator('#services')).toHaveCSS('opacity', '1')
  const card = page.locator('.expert-card').first()
  await card.hover()
  await expect.poll(() => card.evaluate((element) =>
    new DOMMatrixReadOnly(getComputedStyle(element).transform).f,
  )).toBeLessThan(-9)
  await expect(card).toHaveCSS('box-shadow', /255, 76, 49/)
  await page.mouse.move(0, 0)
  await expect.poll(() => card.evaluate((element) =>
    new DOMMatrixReadOnly(getComputedStyle(element).transform).f,
  )).toBeCloseTo(0, 1)

  await page.locator('.contact-info h2').evaluate((element) =>
    element.scrollIntoView({ block: 'center', behavior: 'instant' }),
  )
  await expect(page.locator('#contact-me')).toHaveCSS('opacity', '1')
  const name = page.getByLabel('Name*', { exact: true })
  await name.focus()
  await expect(name).toHaveCSS('border-color', 'rgb(255, 76, 49)')
  await expect(name).toHaveCSS('box-shadow', /rgba\(255, 76, 49, 0\.6\).*20px.*inset/)
  await page.getByLabel('Email Address*', { exact: true }).focus()
  await expect(name).not.toHaveCSS('box-shadow', /inset/)
  await expect(name).toHaveCSS('background-color', 'rgba(255, 255, 255, 0.03)')
})

test('submits the Web3Forms payload once and displays the original success message', async ({ page }) => {
  let pending: Route | undefined
  let submissions = 0
  await page.route(submissionEndpoint, (route) => {
    submissions += 1
    pending = route
  })
  await page.goto('/')
  await fillContactForm(page)
  await page.getByRole('button', { name: 'Submit', exact: true }).click()
  await expect.poll(() => submissions).toBe(1)
  await expect(page.getByRole('button', { name: 'Sending...' })).toBeDisabled()
  await page.locator('#my-form').evaluate((form: HTMLFormElement) => form.requestSubmit())
  expect(submissions).toBe(1)
  if (!pending) throw new Error('The expected Web3Forms request was not intercepted.')
  const request = pending.request()
  expect(request.method()).toBe('POST')
  expect(request.headers()['content-type']).toBe('application/json')
  expect(request.postDataJSON()).toMatchObject({
    access_key: 'web3forms-test-key',
    name: sample.name,
    email: sample.email,
    replyto: sample.email,
    phone: sample.phone,
    message: sample.message,
  })
  expect(request.postDataJSON()).not.toHaveProperty('comment')
  await pending.fulfill({ status: 200, json: { success: true } })
  await expect(page.locator('#my-form')).toBeHidden()
  await expect(page.getByRole('status')).toHaveText(successCopy)
})

for (const failure of ['http', 'rejected', 'truthy-success', 'invalid-json', 'network'] as const) {
  test(`contact form recovers from ${failure} failure without losing the message`, async ({ page }) => {
    await page.route(submissionEndpoint, (route) => {
      if (failure === 'network') return route.abort('failed')
      if (failure === 'invalid-json') return route.fulfill({ status: 200, contentType: 'text/html', body: '<html>Unavailable</html>' })
      return route.fulfill({
        status: failure === 'http' ? 503 : 200,
        json: { success: failure === 'truthy-success' ? 'true' : failure === 'http' },
      })
    })
    await page.goto('/')
    await fillContactForm(page)
    await page.getByRole('button', { name: 'Submit', exact: true }).click()
    await expect(page.getByRole('alert')).toContainText('Please try again')
    await expectRetainedInputs(page)
    // A visitor can retry the same message successfully after a recoverable error.
    await page.route(submissionEndpoint, (route) => route.fulfill({ status: 200, json: { success: true } }))
    await page.getByRole('button', { name: 'Submit', exact: true }).click()
    await expect(page.getByRole('status')).toHaveText(successCopy)
  })
}

test('a stalled contact request times out and retains the entered message', async ({ page }) => {
  let submissions = 0
  await page.route(submissionEndpoint, () => { submissions += 1 })
  await page.clock.install()
  await page.goto('/')
  await fillContactForm(page)
  await page.getByRole('button', { name: 'Submit', exact: true }).click()
  await expect.poll(() => submissions).toBe(1)
  await page.clock.fastForward(15_100)
  await expect(page.getByRole('alert')).toContainText('The request timed out')
  await expectRetainedInputs(page)
})

test('missing access key provides the contact email without sending a request', async ({ page }) => {
  let submissions = 0
  page.on('request', (request) => { if (request.url() === submissionEndpoint) submissions += 1 })
  await page.goto('http://127.0.0.1:4174')
  await fillContactForm(page)
  await page.getByRole('button', { name: 'Submit', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('md40redoan47@gmail.com')
  await expect(page.getByRole('alert')).toContainText('not available yet')
  await expectRetainedInputs(page)
  expect(submissions).toBe(0)
})
