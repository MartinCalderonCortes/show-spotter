export type Show = {
  id: number,
  title: string,
  image: string,
  rating: number | 'N/A',
  genres: string,
  summary: string
}

export type ShowDetail = Show & {
  schedule: string,
  networkInfo: string
}

export type View = 'search' | 'favorites'