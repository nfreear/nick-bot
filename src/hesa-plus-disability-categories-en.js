/**
 * A draft of HESA-Plus disability classification.
 *
 * @author NDF, 18-February-2020.
 *
 * @see https://www.hesa.ac.uk/collection/c17051/a/disable
 * @see https://help.open.ac.uk/disability-support-form
 * @see https://www.ncbi.nlm.nih.gov/books/NBK263824/ ~ Appendix 9: List of long-term conditions.
 *
 * @see https://github.com/nfreear/nicks-chatbot-01/blob/master/cognitiveModels/DisabledStudentNeeds.json
 * @see https://docs.google.com/spreadsheets/d/1gkNHDkhjviAEBLJSCuNPW2oSoN4uBl7BoA6kAqGhzTM/#gid=0
*/

// Purposefully missing terms :~ 'cancer'

const HESA_PLUS_DISABILITY_CATEGORIES = {
  locale: 'en',
  nameKey: 'hesaPlus',
  categories: [
    {
      id: 'spld',
      hesaCode: 51,
      hesa: 'A specific learning difficulty such as dyslexia, dyspraxia or AD(H)D',
      hesaPlus: 'A specific learning difficulty',
      ou: 'Specific learning difficulty',
      aliases: `Dyslexia, Dyspraxia, Dyscalculia,
        ADHD`
    }, {
      id: 'comms:-autism-spec',
      hesaCode: '53-a',
      hesa: 'A social/communication impairment such as Asperger\'s syndrome/other autistic spectrum disorder',
      hesaPlus: 'A social/communication impairment',
      ou: 'Autistic spectrum disorder',
      aliases: `Asperger's, Aspergers, Aspergers syndrome, Autism,
        Autistim spectrum, Autistic`
    }, {
      id: 'comms:-speech',
      hesaCode: '53-b',
      hesa: '',
      hesaPlus: 'A communication or speech impairment',
      ou: 'Speech',
      aliases: `Stammer, Stutter, speech impediment, Cleft palate, Cleft lip,
        Cluttering, Dysfluency, Disfluency,
        Selective mutism, Communication disorder, Voice problem, SLT`
    }, {
      id: 'chronic:-health-condition',
      hesaCode: '54-a',
      hesa: 'A long standing illness or health condition such as cancer, HIV, diabetes, chronic heart disease, or epilepsy',
      hesaPlus: 'A long standing illness, health condition or unseen disability, except fatigue and pain.',
      ou: 'Unseen disability',
      aliases: `Invisible condition, Chron's disease, hidden disability, Epilepsy,
        Fibromyalgia, Multiple sclerosis, MS, heart disease, HIV, Aids`
    }, {
      id: 'chronic:-fatigue-and-pain',
      hesaCode: '54-b',
      hesa: '',
      hesaPlus: 'Chronic fatigue or pain',
      ou: 'Fatigue and pain',
      aliases: `Chronic fatigue, Tired, Exhaustion, Chronic fatigue syndrome, CFS,
        Myalgic encephalomyelitis, Post-viral fatigue syndrome, FVFS,
        M.E., have ME, M-E, from ME`
    }, {
      id: 'sight',
      hesaCode: '58-a',
      hesa: 'Blind or a serious visual impairment uncorrected by glasses',
      hesaPlus: 'Blind or a visual impairment',
      ou: 'Sight',
      aliases: `blind, registered blind, sight-loss, can't see, braille, refractive error,
        cataract, glaucoma, Age related macular degeneration, AMD,
        Diabetic retinopathy, visual impairment, vision loss, blindness,
        color blindness, colour blindness`
    }, {
      id: 'unknown',
      hesaCode: -1,
      hesaPlus: 'Unknown',
      aliases: null
    }
  ]
};

module.exports = HESA_PLUS_DISABILITY_CATEGORIES;
