export const Subjects = {
  ingestUploaded: 'ingest.uploaded',
  ingestParsed: 'ingest.parsed',
  ingestEmbedded: 'ingest.embedded',
  ingestIndexed: 'ingest.indexed',
  agentsStatus: 'agents.status.*',
  quizGenerated: 'quiz.generated',
  sessionAnswer: 'session.answer',
  sessionCompleted: 'session.completed',
  uiDislike: 'ui.feedback.dislike',
  uiRegenerate: 'ui.item.regenerate',
} as const;

export type SubjectKey = keyof typeof Subjects;
