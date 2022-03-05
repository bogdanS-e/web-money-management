function stringToColor(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }

  return color;
}

export function stringAvatar(name: string) {
  let children: string;

  if (name.includes(' ')) {
    children = `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
  } else {
    children = `${name.split('')[0]}${name.split('')[1]}`
  }

  return {
    style: {
      backgroundColor: stringToColor(name),
    },
    children,
  };
}