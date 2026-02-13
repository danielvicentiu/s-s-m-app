import { NextRequest, NextResponse } from 'next/server'

type ContactFormData = {
  name: string
  email: string
  company?: string
  requestType: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()

    // Validare date
    if (!body.name || !body.email || !body.message || !body.requestType) {
      return NextResponse.json(
        { error: 'Toate câmpurile obligatorii trebuie completate' },
        { status: 400 }
      )
    }

    // Validare email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Adresa de email nu este validă' },
        { status: 400 }
      )
    }

    // Validare lungime mesaj
    if (body.message.length < 10) {
      return NextResponse.json(
        { error: 'Mesajul trebuie să conțină cel puțin 10 caractere' },
        { status: 400 }
      )
    }

    // Log pentru debugging (în producție ar trebui salvat în DB sau trimis prin email)
    console.log('Contact form submission:', {
      name: body.name,
      email: body.email,
      company: body.company || 'N/A',
      requestType: body.requestType,
      messageLength: body.message.length,
      timestamp: new Date().toISOString(),
    })

    // TODO: În producție, aici ar trebui:
    // 1. Salvat în tabela contact_submissions din Supabase
    // 2. Trimis email către administratori
    // 3. Opțional: integrat cu CRM sau sistem de ticketing

    // Exemplu pseudo-code pentru salvare în Supabase:
    // const { createSupabaseServer } = await import('@/lib/supabase/server')
    // const supabase = await createSupabaseServer()
    // const { error } = await supabase.from('contact_submissions').insert({
    //   name: body.name,
    //   email: body.email,
    //   company: body.company,
    //   request_type: body.requestType,
    //   message: body.message,
    //   submitted_at: new Date().toISOString(),
    //   status: 'new'
    // })

    return NextResponse.json(
      {
        success: true,
        message: 'Mesajul a fost trimis cu succes',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'A apărut o eroare la procesarea cererii' },
      { status: 500 }
    )
  }
}
