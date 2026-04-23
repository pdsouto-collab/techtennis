// src/utils/insights.ts
import type { PerformanceFeedback, StringingJob } from '../types';

export function generateRecommendation(feedback: PerformanceFeedback | null, job: StringingJob | null): string | null {
  if (!feedback || !job) return null;

  const recommendations: string[] = [];
  const { kpis } = feedback;

  // Se o conforto estiver avaliado como ruim (1 ou 2)
  if (kpis.comfort <= 2) {
    recommendations.push(
      `O cliente relatou falta de conforto. Sugestão: reduzir a tensão em cerca de 2 a 3 lbs, ou utilizar uma corda mais macia (ex: multifilamento ou tripa natural).`
    );
  }

  // Se a falta de controle for evidente (1 ou 2)
  if (kpis.control <= 2) {
    recommendations.push(
      `Controle avaliado como baixo. Sugestão: aumentar a tensão atual de ${job.tensionMainLbs}/${job.tensionCrossLbs} lbs para maior firmeza na batida, ou usar um poliéster de maior controle.`
    );
  }

  // Falta de potência
  if (kpis.power <= 2) {
    recommendations.push(
      `Potência insatisfatória. Sugestão: diminuir a tensão (tramas mais soltas geram mais efeito trampolim) ou optar por um calibre mais fino.`
    );
  }

  // Baixa manutenção de tensão
  if (kpis.tensionMaintenance <= 2) {
    recommendations.push(
      `Baixa manutenção de tensão. Sugestão: aplicar pré-estiramento (Pre-Stretch) de 5% a 10% no próximo serviço para melhor estabilidade.`
    );
  }

  return recommendations.length > 0 
    ? recommendations.join(" | ") 
    : "Feedback positivo no serviço anterior. Manter a configuração atual (tensão e cordas).";
}
