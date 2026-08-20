import DonationForm from '../../components/donation/DonationForm'

interface DonasiPageWrapperProps {
  initialZakatAmount?: number
  initialZakatType?: 'profesi' | 'maal'
  initialProgram?: string

  initialCampaignId?: number | null
  initialStep?: 1 | 2 | 3
}

export default function DonasiPageWrapper({
  initialZakatAmount,
  initialZakatType,
  initialProgram,
  initialCampaignId,
  initialStep,
}: DonasiPageWrapperProps) {
  return (
    <DonationForm
      initialZakatAmount={
        initialZakatAmount
      }
      initialZakatType={
        initialZakatType
      }
      initialProgram={
        initialProgram
      }
      initialCampaignId={
        initialCampaignId
      }
      initialStep={
        initialStep
      }
    />
  )
}