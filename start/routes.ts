// start/routes.ts
import router from '@adonisjs/core/services/router'
import Database from '@adonisjs/lucid/services/db'

// Lazy imports de controladores
const CandidatesController = () => import('#controllers/candidates_controller')
const CandidateFilesController = () => import('#controllers/candidate_files_controller')
const CandidateAddressMediaController = () =>
  import('#controllers/candidate_address_media_controller')
const InterviewsController = () => import('#controllers/interviews_controller')
const PsychTestsController = () => import('#controllers/psych_tests_controller')
const OffersController = () => import('#controllers/offers_controller')
const PublicController = () => import('#controllers/public_controller')

const PreviousJobsController = () => import('#controllers/previous_jobs_controller')
const PublicApplyFullController = () => import('#controllers/public_apply_full_controller')
const PublicPracticalTestsController = () =>
  import('#controllers/public_practical_tests_controller')

// Health simple para DB
router.get('/health-db', async () => {
  await Database.rawQuery('SELECT 1')
  return { db: 'ok' }
})

router
  .group(() => {
    // ───────── CANDIDATES ─────────
    router.get('/candidates', [CandidatesController, 'index'])
    router.post('/candidates', [CandidatesController, 'store'])
    router.get('/candidates/:id', [CandidatesController, 'show'])
    router.patch('/candidates/:id', [CandidatesController, 'update'])
    router.patch('/candidates/:id/stage', [CandidatesController, 'setStage'])

    // ───────── CV FILES ─────────
    router.post('/candidates/:id/cv', [CandidateFilesController, 'upload'])
    router.get('/candidates/:id/cv', [CandidateFilesController, 'list'])
    router.patch('/candidates/:id/cv/:cvId/primary', [CandidateFilesController, 'setPrimary'])
    router.delete('/candidates/:id/cv/:cvId', [CandidateFilesController, 'destroy'])

    // ───────── ADDRESS MEDIA ─────────
    router.post('/candidates/:id/address-media', [CandidateAddressMediaController, 'upload'])
    router.get('/candidates/:id/address-media', [CandidateAddressMediaController, 'list'])
    router.delete('/candidates/:id/address-media/:mediaId', [
      CandidateAddressMediaController,
      'destroy',
    ])

    // ───────── INTERVIEWS ─────────
    router.post('/candidates/:id/interviews', [InterviewsController, 'store'])
    router.patch('/interviews/:id', [InterviewsController, 'update'])

    // ───────── PSYCH TESTS ─────────
    router.post('/candidates/:id/psych-tests', [PsychTestsController, 'store'])
    router.patch('/psych-tests/:id/result', [PsychTestsController, 'result'])

    // ───────── OFFERS ─────────
    // ───────── OFFERS ─────────
    router.post('/candidates/:id/offers', [OffersController, 'store'])
    router.patch('/offers/:id', [OffersController, 'update'])

    // ───────── PUBLIC (sin auth) ─────────
    router.post('/public/apply', [PublicController, 'apply'])
    router.get('/public/psych-tests/:token', [PublicController, 'psychShow'])
    router.post('/public/psych-tests/:token/submit', [PublicController, 'psychSubmit'])
    router.get('/public/offers/:token', [PublicController, 'offerShow'])
    router.post('/public/offers/:token/respond', [PublicController, 'offerRespond'])

    router.post('/public/apply-full', [PublicApplyFullController, 'apply'])
    router.get('/public/practical-tests/:token', [PublicPracticalTestsController, 'show'])
    router.post('/public/practical-tests/:token/submit', [PublicPracticalTestsController, 'submit'])
    router.get('/candidates/:id/practical-tests', [PublicPracticalTestsController, 'index'])
    // ───────── PREVIOUS JOBS ─────────
    router.post('/candidates/:id/previous-jobs', [PreviousJobsController, 'store'])
    router.get('/candidates/:id/previous-jobs', [PreviousJobsController, 'list'])
    router.patch('/previous-jobs/:jobId', [PreviousJobsController, 'update'])
    router.delete('/previous-jobs/:jobId', [PreviousJobsController, 'destroy'])
  })
  .prefix('/api')
