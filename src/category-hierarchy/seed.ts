import { Types } from 'mongoose';

const metaDatas = {
  _id: Types.ObjectId(),
  name: 'Ragtime',
  slug: 'ragtime',
  children: [
    {
      _id: Types.ObjectId(),
      name: 'Bop',
      slug: 'bop',
      children: [
        {
          _id: Types.ObjectId(),
          name: 'Modal Jazz',
          slug: 'modal-jazz'
        },
        {
          _id: Types.ObjectId(),
          name: 'Hard Bop',
          slug: 'hard-bop'
        },
        {
          _id: Types.ObjectId(),
          name: 'Free Jazz',
          slug: 'free-jazz'
        }
      ]
    }
  ]
};

const getLeaves = (tree: any) => {
  const { children, ...rest } = tree;

  if (!tree.children) {
    return tree;
  }

  return tree.children
    .map((child: any) => {
      const ancestor = { _id: tree._id, name: tree.name, slug: tree.slug };
      const ancestors = tree.ancestors ? tree.ancestors.concat([ancestor]) : [ancestor];
      return Object.assign({}, child, { parent: tree._id, ancestors });
    })
    .map(getLeaves)
    .reduce(
      (pre: any, cur: any) => {
        return pre.concat(cur);
      },
      [
        Object.assign({}, rest, {
          parent: rest.parent ? rest.parent : null,
          ancestors: rest.ancestors ? rest.ancestors : []
        })
      ]
    );
};

function main(metas: any = metaDatas): any[] {
  return getLeaves(metas);
}

export { main, getLeaves, metaDatas };
