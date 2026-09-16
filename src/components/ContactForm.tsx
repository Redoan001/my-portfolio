import { useEffect, useRef, useState, type FormEvent } from 'react'
import { LoaderCircle } from 'lucide-react'

const contactEmail = 'md40redoan47@gmail.com'

export function ContactForm() {
  const [isSending, setIsSending] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const activeRequest = useRef<AbortController | null>(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
      activeRequest.current?.abort()
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (activeRequest.current || isSubmitted) return

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim()

    if (!accessKey) {
      setError(`The contact form is not available yet. Please email ${contactEmail}.`)
      return
    }

    const fields = new FormData(event.currentTarget)
    const controller = new AbortController()
    activeRequest.current = controller
    let timedOut = false

    const timeoutId = window.setTimeout(() => {
      timedOut = true
      controller.abort()
    }, 15_000)

    setError('')
    setIsSending(true)

    try {
      const email = String(fields.get('email') ?? '')
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: 'New portfolio enquiry for MD Redoan',
          from_name: 'MD Redoan Portfolio',
          name: String(fields.get('name') ?? ''),
          email,
          replyto: email,
          phone: String(fields.get('phone') ?? ''),
          message: String(fields.get('comment') ?? ''),
          ...(fields.has('botcheck') ? { botcheck: fields.get('botcheck') } : {}),
        }),
        signal: controller.signal,
      })
      const result: unknown = await response.json()

      if (
        !response.ok ||
        typeof result !== 'object' ||
        result === null ||
        !('success' in result) ||
        result.success !== true
      ) {
        throw new Error('The form service did not confirm the submission.')
      }

      if (isMounted.current) setIsSubmitted(true)
    } catch {
      if (isMounted.current) {
        setError(
          timedOut
            ? `The request timed out. Please try again or email ${contactEmail}.`
            : `Oops! There was a problem submitting your form. Please try again or email ${contactEmail}.`,
        )
      }
    } finally {
      window.clearTimeout(timeoutId)
      activeRequest.current = null
      if (isMounted.current) setIsSending(false)
    }
  }

  return (
    <div className="contact-form-container">
      <h3>Provide me with the details</h3>
      <form
        id="my-form"
        onSubmit={handleSubmit}
        hidden={isSubmitted}
        aria-busy={isSending}
      >
        <input
          type="checkbox"
          name="botcheck"
          className="hidden"
          hidden
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <div className="form-group">
          <label htmlFor="name">Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Full Name"
            autoComplete="name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address*</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number*</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Your Phone Number"
            autoComplete="tel"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="comment">Leave Your Message*</label>
          <textarea
            id="comment"
            name="comment"
            rows={5}
            placeholder="What Would You Like To Discuss?"
            required
          />
        </div>
        <button type="submit" className="btn-submit" disabled={isSending}>
          {isSending ? (
            <>
              <LoaderCircle
                size={16}
                className="mr-2 inline-block animate-spin align-middle motion-reduce:animate-none"
                aria-hidden="true"
              />
              Sending...
            </>
          ) : (
            'Submit'
          )}
        </button>
        <p role="alert" aria-live="assertive" aria-atomic="true" className={error ? 'mt-4 text-sm text-(--accent)' : 'hidden'}>
          {error}
        </p>
      </form>
      <div id="success-message" role="status" aria-live="polite" aria-atomic="true">
        {isSubmitted && (
          <p className="p-5 text-center text-[1.2rem] font-extrabold text-(--accent)">
            Thanks! I have received your query and will get back to you as soon as
            possible. Looking forward to connecting with you!
          </p>
        )}
      </div>
    </div>
  )
}
