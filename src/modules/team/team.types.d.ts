type PopulatedWithRecruitments<T> = T & {
  recruitments: MongoDoc<import('./recruitment.schema').Recruitment>[];
};
