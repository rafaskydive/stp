export default function (exit_altitude, deployment_altitude) {
  if(exit_altitude && deployment_altitude) {
    return Math.ceil((((exit_altitude - deployment_altitude) / 1000) * 5.5) + 5)
  }
  return ''
}
