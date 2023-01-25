export class Headlines {
  status: string = '';
  totalResults: number = 0;
  articles: Article[] = [];
}

export class Article {
  source: Source = new Source();
  author: string = '';
  title: string = '';
  description: string = '';
  url: string = '';
  urlToImage: string = '';
  publishedAt: string = '';
  content: string = '';
  spectrumEnabled: boolean = false;
}

export class Source {
  id: string = '';
  name: string = '';
}

export class Metrics {
  userID: number = 0;
  categoryToNumArticles: { category: string; articleCount: number } = {
    category: '',
    articleCount: 0,
  };
  sourceToNumArticles: { source: string; articleCount: number } = {
    source: '',
    articleCount: 0,
  };
}

export class NewMetric {
  category: string = ``;
  source: string = ``;
}
