export interface DockerContainer {
  id: string
  name: string
  image: string
  status: string
  state: string
  ports: string
  created: number
  uptime: number | null
}

export interface DockerImage {
  id: string
  repository: string
  tag: string
  size: number
  created: number
}

export interface DockerNetwork {
  id: string
  name: string
  driver: string
  scope: string
  containers: number
}

export interface DockerActionRequest {
  containerId: string
  action: 'start' | 'stop' | 'restart' | 'remove'
}

export interface DockerLogsQuery {
  containerId: string
  tail?: number
}
