import { Grid, Typography } from '@mui/material';
import { t } from 'i18next';
import { useFormState } from 'react-hook-form';
import type { CustomButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { colorPalette } from '@/styles/color-palette';
import { Input } from '@/components/data-entry/input';
import type { EthKVStoreKeyValues } from '@/smart-contracts/EthKVStore/config';
import { EthKVStoreKeys, Role } from '@/smart-contracts/EthKVStore/config';
import { Select } from '@/components/data-entry/select';
import { MultiSelect } from '@/components/data-entry/multi-select';
import { JOB_TYPES } from '@/shared/consts';
import type { GetEthKVStoreValuesSuccessResponse } from '@/api/services/operator/get-keys';
import {
  order,
  sortFormKeys,
} from '@/pages/operator/sign-up/add-keys/sort-form';

const OPTIONS = [Role.ExchangeOracle, Role.JobLauncher, Role.RecordingOracle];

const formInputsConfig: Record<EthKVStoreKeyValues, React.ReactElement> = {
  [EthKVStoreKeys.Fee]: (
    <Input
      fullWidth
      label={t('operator.addKeysPage.existingKeys.fee')}
      mask="PercentsInputMask"
      name={EthKVStoreKeys.Fee}
    />
  ),
  [EthKVStoreKeys.PublicKey]: (
    <Input
      fullWidth
      label={t('operator.addKeysPage.existingKeys.publicKey')}
      name={EthKVStoreKeys.PublicKey}
    />
  ),
  [EthKVStoreKeys.Url]: (
    <Input
      fullWidth
      label={t('operator.addKeysPage.existingKeys.url')}
      name={EthKVStoreKeys.Url}
    />
  ),
  [EthKVStoreKeys.WebhookUrl]: (
    <Input
      fullWidth
      label={t('operator.addKeysPage.existingKeys.webhookUrl')}
      name={EthKVStoreKeys.WebhookUrl}
    />
  ),
  [EthKVStoreKeys.Role]: (
    <Select
      isChipRenderValue
      label={t('operator.addKeysPage.existingKeys.role')}
      name={EthKVStoreKeys.Role}
      options={OPTIONS.map((role, i) => ({
        name: role,
        value: role,
        id: i,
      }))}
    />
  ),
  [EthKVStoreKeys.JobTypes]: (
    <MultiSelect
      label={t('operator.addKeysPage.existingKeys.jobType')}
      name={EthKVStoreKeys.JobTypes}
      options={JOB_TYPES}
    />
  ),
};
export function EditExistingKeysForm({
  existingKeysInitialState,
  formButtonProps,
}: {
  existingKeysInitialState: GetEthKVStoreValuesSuccessResponse;
  formButtonProps: CustomButtonProps;
}) {
  const { errors } = useFormState();
  const noChangesError = errors.form?.message as string;

  const sortedKeys = sortFormKeys(
    Object.keys(existingKeysInitialState) as EthKVStoreKeyValues[],
    order
  );

  return (
    <Grid container sx={{ flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="body4">
        {t('operator.addKeysPage.existingKeys.title')}
      </Typography>
      <Grid container sx={{ flexDirection: 'column', gap: '2rem' }}>
        {sortedKeys.map((key) => {
          const formInputsConfigKey = key as EthKVStoreKeyValues;
          return (
            <>
              {existingKeysInitialState[formInputsConfigKey]
                ? formInputsConfig[formInputsConfigKey]
                : null}
            </>
          );
        })}

        {noChangesError ? (
          <div>
            <Typography
              color={colorPalette.error.main}
              component="div"
              variant="helperText"
            >
              {noChangesError}
            </Typography>
          </div>
        ) : null}
        <div>
          <Button {...formButtonProps}>
            <Typography color={colorPalette.white} variant="buttonMedium">
              {t('operator.addKeysPage.editKeysForm.btn')}
            </Typography>
          </Button>
        </div>
      </Grid>
    </Grid>
  );
}
