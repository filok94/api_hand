export interface IPropObject {
  prop_name: string;
  prop_values: string[] | number[];
  with_probability: boolean;
}
export interface IReturnedOneAvatar {
  ref_name: string;
  base_link: string;
  props: IPropObject[];
}

export interface IAllAvatar {
  ref_name: string;
  base_link: string;
  id: mongoose.Schema.Types.ObjectId;
}
