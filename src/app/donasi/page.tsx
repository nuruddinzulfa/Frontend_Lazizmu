import DonationForm from '../../components/donation/DonationForm'

interface DonasiPageWrapperProps {
  initialZakatAmount?: number
  initialZakatType?: 'profesi' | 'maal'
  initialProgram?: string
}

export default function DonasiPageWrapper({
  initialZakatAmount,
  initialZakatType,
  initialProgram,
}: DonasiPageWrapperProps) {
  return (
    <DonationForm
      initialZakatAmount={initialZakatAmount}
      initialZakatType={initialZakatType}
      initialProgram={initialProgram}
    />
  )
}