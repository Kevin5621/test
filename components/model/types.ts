export interface Screenshot {
  title: string;
  image: string;
}

export interface FeatureSection {
  title: string;
  items: string[];
}

export interface ProjectFeatures {
  sections: FeatureSection[];
}

export interface Project {
  title: string;
  description: string;
  image: Screenshot[];
  technologies: string[];
  githubUrl: string;
  features?: ProjectFeatures;
}