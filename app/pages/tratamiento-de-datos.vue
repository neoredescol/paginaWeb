<script setup lang="ts">
useSeoMeta({
  title: 'Tratamiento de Datos | NEO REDES',
  description: 'Conoce los principios y criterios generales de NEO REDES para el tratamiento responsable de datos personales.',
  ogTitle: 'Tratamiento de Datos | NEO REDES',
  ogDescription: 'Conoce los principios y criterios generales de NEO REDES para el tratamiento responsable de datos personales.',
  ogUrl: 'https://neo-redes.com/tratamiento-de-datos',
  ogType: 'website',
  ogSiteName: 'NEO REDES',
  ogLocale: 'es_CO',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://neo-redes.com/tratamiento-de-datos' }],
})
const updatedAt = '26 de agosto de 2026'
const sections = [
  { id: 'objeto', title: 'Objeto', paragraphs: ['Establecer lineamientos generales para el tratamiento responsable de los datos personales que sean facilitados a NEO REDES en el desarrollo de sus actividades y relaciones de servicio.'] },
  { id: 'alcance', title: 'Alcance', paragraphs: ['Aplica a la información personal recibida mediante los canales de contacto, comunicaciones comerciales, propuestas, acuerdos y ejecución de servicios.'] },
  { id: 'definiciones', title: 'Definiciones', paragraphs: ['Para este documento, dato personal es la información asociada o asociable a una persona; titular es la persona a quien corresponde la información; tratamiento comprende las operaciones realizadas sobre esos datos; y autorización es el consentimiento aplicable para su uso.'] },
  { id: 'principios', title: 'Principios aplicables', paragraphs: ['El tratamiento procurará respetar criterios de finalidad legítima, libertad, transparencia, acceso restringido, seguridad, confidencialidad, calidad y circulación limitada de la información. Las referencias normativas específicas deben revisarse jurídicamente antes de la publicación definitiva.'] },
  { id: 'datos-tratados', title: 'Datos personales objeto de tratamiento', paragraphs: ['Podrán tratarse datos de identificación y contacto, información profesional o comercial y materiales suministrados voluntariamente que resulten necesarios para atender una solicitud o desarrollar una relación de servicios.'] },
  { id: 'finalidades', title: 'Finalidades', paragraphs: ['Responder comunicaciones, evaluar solicitudes, preparar cotizaciones o propuestas, gestionar relaciones contractuales, prestar servicios, realizar seguimiento y atender obligaciones asociadas a la relación correspondiente.'] },
  { id: 'datos-sensibles', title: 'Tratamiento de datos sensibles', paragraphs: ['NEO REDES no afirma recopilar habitualmente datos sensibles. Si excepcionalmente fueran necesarios, se informará su carácter facultativo y se solicitarán las autorizaciones y condiciones reforzadas que correspondan.'] },
  { id: 'menores', title: 'Datos de niños, niñas y adolescentes', paragraphs: ['Su tratamiento no forma parte de los canales generales. Cuando un proyecto haga indispensable utilizar información o imagen de menores, deberán priorizarse sus derechos y obtenerse las autorizaciones pertinentes.'] },
  { id: 'derechos', title: 'Derechos de los titulares', paragraphs: ['Los titulares podrán conocer, actualizar y corregir su información; solicitar detalles sobre el uso realizado; presentar consultas o reclamos; y pedir revocatoria o supresión cuando resulte procedente.'] },
  { id: 'deberes', title: 'Deberes del responsable', paragraphs: ['Quien determine las finalidades del tratamiento deberá facilitar el ejercicio de derechos, conservar la información bajo condiciones razonables de seguridad, mantenerla actualizada cuando corresponda y atender las obligaciones aplicables. La identificación jurídica completa del responsable está pendiente de confirmación.'] },
  { id: 'autorizacion', title: 'Autorización', paragraphs: ['Cuando sea necesaria, la autorización deberá ser previa, informada y verificable. Podrá obtenerse por medios escritos, digitales o mediante conductas inequívocas permitidas, según la interacción y el marco aplicable.'] },
  { id: 'consultas', title: 'Procedimiento para consultas', paragraphs: ['Las consultas deberán identificar al solicitante y describir claramente la información requerida. Se responderán por un medio adecuado dentro de los plazos que establezca la normativa aplicable, pendientes de validación jurídica específica.'] },
  { id: 'reclamos', title: 'Procedimiento para reclamos', paragraphs: ['Los reclamos deberán explicar los hechos, identificar al titular, indicar un medio de respuesta y adjuntar los soportes disponibles. Si falta información necesaria, podrá solicitarse su complemento antes de continuar el trámite.'] },
  { id: 'revocatoria', title: 'Revocatoria y supresión', paragraphs: ['El titular podrá solicitar la revocatoria de una autorización o la supresión de sus datos cuando resulte procedente. La petición podrá limitarse cuando exista un deber contractual o legal que justifique conservar la información.'] },
  { id: 'seguridad', title: 'Seguridad de la información', paragraphs: ['Se procurarán medidas administrativas y técnicas proporcionales para prevenir accesos no autorizados, pérdida, alteración o divulgación indebida, sin que esto implique una garantía absoluta frente a todo riesgo.'] },
  { id: 'transferencias', title: 'Transmisión o transferencia de datos', paragraphs: ['No se afirma la existencia de transferencias internacionales ni de operadores específicos. Si un servicio requiere compartir información con un tercero, deberán definirse previamente su necesidad, alcance y condiciones aplicables.'] },
  { id: 'vigencia', title: 'Vigencia', paragraphs: ['Este documento rige desde su publicación y deberá revisarse cuando cambien las prácticas de tratamiento o las obligaciones aplicables. La vigencia de bases o datos dependerá de sus finalidades y requisitos aplicables.'] },
  { id: 'contacto', title: 'Contacto', paragraphs: ['Las consultas generales pueden dirigirse a neoredescol@gmail.com o al WhatsApp +57 320 552 0676. Debe confirmarse jurídicamente si estos serán los canales formales para consultas y reclamos.'] },
]
</script>
<template><LegalPageLayout eyebrow="PROTECCIÓN DE INFORMACIÓN" title-top="TRATAMIENTO" title-accent="DE DATOS" intro="Principios y criterios generales para gestionar datos personales con responsabilidad." :updated-at="updatedAt" :sections="sections" /></template>
