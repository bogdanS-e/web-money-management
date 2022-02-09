import React from 'react';
import styled from 'styled-components';
import {
  List,
  ListItemIcon,
  Checkbox,
  ListItem,
  ListItemText,
} from '@material-ui/core';

type DataType = {
  title: string;
};

interface Props<T> {
  data: Array<T>;
  onChange: (data: Array<T>) => void;
  checkedData: Array<T>;
  maxChecked?: number;
}

const CheckboxList = <T extends DataType>({
  data,
  onChange,
  checkedData,
  maxChecked,
}: Props<T>) => {
  const [checked, setChecked] = React.useState<Array<T>>(checkedData);

  const handleToggle = React.useCallback(
    (value: string) => () => {
      setChecked((prev) => {
        const currentEl = prev.find(({ title }) => title === value);

        if (currentEl) {
          const idx = prev.findIndex(({ title }) => value === title);
          const newData = [...prev.slice(0, idx), ...prev.slice(idx + 1)];

          onChange(newData);

          return newData;
        }

        const el = data.find(({ title }) => value === title);

        if (el) {
          const newData = [...prev, el];

          onChange(newData);

          return newData;
        }

        onChange(prev);
        return prev;
      });
    },
    [data, onChange],
  );

  const disableItems = React.useMemo(() => {
    if (!maxChecked) return false;

    return checked.length >= maxChecked;
  }, [checked, maxChecked]);

  return (
    <StyledList>
      {data.map(({ title }) => {
        const isChecked = Boolean(
          checked?.find(({ title: checkedTitle }) => title === checkedTitle),
        );

        return (
          <StyledListItem
            key={title}
            role={undefined}
            onClick={handleToggle(title)}
            disabled={disableItems && !isChecked}
            button
          >
            <ListItemIcon>
              <StyledCheckbox
                checked={isChecked}
                tabIndex={-1}
                color='primary'
                disableRipple
                disabled={disableItems && !isChecked}
              />
            </ListItemIcon>
            <ListItemText primary={title} />
          </StyledListItem>
        );
      })}
    </StyledList>
  );
};

const StyledList = styled(List)`
  max-height: 200px;
  max-width: 400px;
`;

const StyledListItem = styled(ListItem)``;

const StyledCheckbox = styled(Checkbox)`
  padding: 5px;
`;

export default CheckboxList;
