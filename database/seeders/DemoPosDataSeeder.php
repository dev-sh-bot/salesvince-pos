<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Counter;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Permission;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Role;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Supplier;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Populate the local POS with linked, repeatable demonstration data.
 *
 * This is intentionally separate from DatabaseSeeder so production installs
 * are not filled with demo transactions unless this seeder is requested.
 */
class DemoPosDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedSettings();
        [$admin, $manager, $cashier, $inventoryUser] = $this->seedUsersAndRoles();
        [$branches, $counters] = $this->seedBranchesAndCounters($admin, $manager, $cashier, $inventoryUser);
        $products = $this->seedProducts();
        $services = $this->seedServices();
        $customers = $this->seedCustomers($admin);
        $suppliers = $this->seedSuppliers();

        $this->seedPurchases($inventoryUser, $products, $suppliers);
        $this->seedOrders($admin, $manager, $cashier, $branches, $counters, $products, $services, $customers);
        $this->seedReadyCarts($admin, $products, $services);

        // Leave a couple of products in the low-stock range so the dashboard
        // has a meaningful warning widget to display.
        Product::whereIn('barcode', ['101028', '101029', '101030'])
            ->update(['quantity' => 6]);
    }

    private function seedSettings(): void
    {
        $settings = [
            'app_name' => 'Salevince POS',
            'app_description' => 'POINT OF SALE',
            'currency_symbol' => 'PKR',
            'warning_quantity' => '10',
            'show_products' => '1',
            'show_services' => '1',
            'tax_enabled' => '1',
            'discount_enabled' => '1',
            'editable_item_rate' => '1',
            'srb_enabled' => '0',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }

    /** @return array{0: User, 1: User, 2: User, 3: User} */
    private function seedUsersAndRoles(): array
    {
        $adminRole = Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Admin', 'description' => 'Full system access.', 'is_system' => true]
        );
        $managerRole = Role::updateOrCreate(
            ['slug' => 'store-manager'],
            ['name' => 'Store Manager', 'description' => 'Manages store operations and inventory.', 'is_system' => false]
        );
        $cashierRole = Role::updateOrCreate(
            ['slug' => 'cashier'],
            ['name' => 'Cashier', 'description' => 'Handles sales and customer checkout.', 'is_system' => false]
        );
        $inventoryRole = Role::updateOrCreate(
            ['slug' => 'inventory'],
            ['name' => 'Inventory Clerk', 'description' => 'Manages suppliers and purchases.', 'is_system' => false]
        );

        $allPermissions = Permission::query()->pluck('id')->all();
        if ($allPermissions !== []) {
            $managerRole->permissions()->sync($allPermissions);
        }

        $salesPermissions = Permission::query()
            ->whereIn('name', [
                'dashboard.view',
                'orders.view',
                'orders.create',
                'orders.edit',
                'customers.view',
                'customers.create',
                'customers.edit',
                'products.view',
                'services.view',
            ])
            ->pluck('id')
            ->all();
        $cashierRole->permissions()->sync($salesPermissions);

        $inventoryPermissions = Permission::query()
            ->whereIn('name', [
                'dashboard.view',
                'products.view',
                'products.create',
                'products.edit',
                'services.view',
                'purchases.view',
                'purchases.create',
                'purchases.edit',
                'suppliers.view',
                'suppliers.create',
                'suppliers.edit',
            ])
            ->pluck('id')
            ->all();
        $inventoryRole->permissions()->sync($inventoryPermissions);

        $admin = User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            ['first_name' => 'Admin', 'last_name' => 'admin', 'password' => Hash::make('admin123'), 'is_active' => true]
        );
        $manager = User::updateOrCreate(
            ['email' => 'manager@salevince.test'],
            ['first_name' => 'Ahsan', 'last_name' => 'Manager', 'password' => Hash::make('manager123'), 'is_active' => true]
        );
        $cashier = User::updateOrCreate(
            ['email' => 'cashier@salevince.test'],
            ['first_name' => 'Sana', 'last_name' => 'Cashier', 'password' => Hash::make('cashier123'), 'is_active' => true]
        );
        $inventoryUser = User::updateOrCreate(
            ['email' => 'inventory@salevince.test'],
            ['first_name' => 'Bilal', 'last_name' => 'Inventory', 'password' => Hash::make('inventory123'), 'is_active' => true]
        );

        $admin->syncRoles([$adminRole->id]);
        $manager->syncRoles([$managerRole->id]);
        $cashier->syncRoles([$cashierRole->id]);
        $inventoryUser->syncRoles([$inventoryRole->id]);

        return [$admin, $manager, $cashier, $inventoryUser];
    }

    /** @return array{0: \Illuminate\Support\Collection, 1: \Illuminate\Support\Collection} */
    private function seedBranchesAndCounters(User ...$users): array
    {
        $branchDefinitions = [
            ['code' => 'BR001', 'name' => 'Main Branch', 'address' => 'Head Office, Clifton Karachi', 'phone' => '03001234567', 'password' => 'MB01'],
            ['code' => 'BR002', 'name' => 'Gulberg Branch', 'address' => 'Main Boulevard Gulberg Lahore', 'phone' => '03011234567', 'password' => 'GB02'],
            ['code' => 'BR003', 'name' => 'Blue Area Branch', 'address' => 'Jinnah Avenue, Islamabad', 'phone' => '03021234567', 'password' => 'BA03'],
        ];

        $branches = collect();
        $counters = collect();
        foreach ($branchDefinitions as $branchDefinition) {
            $branch = Branch::updateOrCreate(
                ['code' => $branchDefinition['code']],
                $branchDefinition + ['is_active' => true]
            );
            $branches->push($branch);

            $counterDefinitions = [
                ['code' => 'C001', 'name' => 'Main Counter', 'password' => 'CT01'],
                ['code' => 'C002', 'name' => 'Express Counter', 'password' => 'CT02'],
                ['code' => 'C003', 'name' => 'Wholesale Counter', 'password' => 'CT03'],
            ];
            foreach ($counterDefinitions as $counterDefinition) {
                $counter = Counter::updateOrCreate(
                    ['branch_id' => $branch->id, 'code' => $counterDefinition['code']],
                    $counterDefinition + ['is_active' => true]
                );
                $counters->push($counter);
            }
        }

        $admin = $users[0];
        $manager = $users[1];
        $cashier = $users[2];
        $inventoryUser = $users[3];
        $admin->branches()->sync($branches->pluck('id')->all());
        $admin->counters()->sync($counters->pluck('id')->all());
        $manager->branches()->sync($branches->take(2)->pluck('id')->all());
        $manager->counters()->sync($counters->take(6)->pluck('id')->all());
        $cashier->branches()->sync([$branches->first()->id]);
        $cashier->counters()->sync($counters->take(2)->pluck('id')->all());
        $inventoryUser->branches()->sync($branches->pluck('id')->all());
        $inventoryUser->counters()->sync($counters->pluck('id')->all());

        return [$branches, $counters];
    }

    private function seedProducts(): \Illuminate\Support\Collection
    {
        $catalog = [
            ['name' => 'Pepsi 1.5L', 'barcode' => '100001', 'price' => 180, 'purchase_price' => 140, 'quantity' => 100, 'description' => 'Chilled 1.5 Liter Soft Drink Bottle'],
            ['name' => 'Coca Cola 1.5L', 'barcode' => '100002', 'price' => 180, 'purchase_price' => 140, 'quantity' => 100, 'description' => 'Refreshing 1.5 Liter Cola Bottle'],
            ['name' => 'Lays Potato Chips Large', 'barcode' => '100003', 'price' => 100, 'purchase_price' => 75, 'quantity' => 150, 'description' => 'Masala Flavor Crispy Potato Chips'],
            ['name' => 'Nestle Pure Life Water 1.5L', 'barcode' => '100004', 'price' => 90, 'purchase_price' => 65, 'quantity' => 200, 'description' => 'Purified Mineral Drinking Water'],
            ['name' => 'Cadbury Dairy Milk Silk', 'barcode' => '100005', 'price' => 350, 'purchase_price' => 280, 'quantity' => 80, 'description' => 'Premium Chocolate Bar 150g'],
            ['name' => 'Olpers Milk 1L', 'barcode' => '100006', 'price' => 290, 'purchase_price' => 250, 'quantity' => 120, 'description' => 'Full Cream UHT Milk Pack'],
            ['name' => 'Nescafe Gold Coffee 100g', 'barcode' => '100007', 'price' => 1450, 'purchase_price' => 1200, 'quantity' => 40, 'description' => 'Rich and aromatic instant coffee'],
            ['name' => 'Lipton Yellow Label Tea 450g', 'barcode' => '100008', 'price' => 950, 'purchase_price' => 800, 'quantity' => 60, 'description' => 'Black tea leaves box'],
            ['name' => 'Dawn Bread Large', 'barcode' => '100009', 'price' => 160, 'purchase_price' => 130, 'quantity' => 50, 'description' => 'Fresh white sandwich bread'],
            ['name' => 'Tapal Danedar Tea 450g', 'barcode' => '100010', 'price' => 920, 'purchase_price' => 780, 'quantity' => 70, 'description' => 'Premium strong danedar tea'],
            ['name' => 'Shan Biryani Masala', 'barcode' => '100011', 'price' => 130, 'purchase_price' => 100, 'quantity' => 200, 'description' => 'Authentic spice mix'],
            ['name' => 'Surf Excel Powder 1kg', 'barcode' => '100012', 'price' => 680, 'purchase_price' => 570, 'quantity' => 90, 'description' => 'Washing powder pack'],
            ['name' => 'Lux Soap Bar 140g', 'barcode' => '100013', 'price' => 150, 'purchase_price' => 115, 'quantity' => 180, 'description' => 'Fragrant rose beauty soap'],
            ['name' => 'Head and Shoulders Shampoo 360ml', 'barcode' => '100014', 'price' => 790, 'purchase_price' => 650, 'quantity' => 60, 'description' => 'Anti-dandruff shampoo'],
            ['name' => 'Colgate Toothpaste 150g', 'barcode' => '100015', 'price' => 280, 'purchase_price' => 220, 'quantity' => 110, 'description' => 'MaxFresh peppermint toothpaste'],
            ['name' => 'National Achar Gosht Masala', 'barcode' => '101016', 'price' => 145, 'purchase_price' => 110, 'quantity' => 95, 'description' => 'Spiced achar gosht recipe mix'],
            ['name' => 'Surf Excel Liquid 1L', 'barcode' => '101017', 'price' => 520, 'purchase_price' => 430, 'quantity' => 75, 'description' => 'Liquid laundry detergent'],
            ['name' => 'Dettol Hand Wash 250ml', 'barcode' => '101018', 'price' => 245, 'purchase_price' => 195, 'quantity' => 130, 'description' => 'Antibacterial hand wash'],
            ['name' => 'EveryDay Tea 950g', 'barcode' => '101019', 'price' => 1180, 'purchase_price' => 990, 'quantity' => 65, 'description' => 'Family pack black tea'],
            ['name' => 'K&N Chicken Nuggets  nugget', 'barcode' => '101020', 'price' => 890, 'purchase_price' => 720, 'quantity' => 45, 'description' => 'Frozen chicken nuggets pack'],
            ['name' => 'Dalda Cooking Oil 1L', 'barcode' => '101021', 'price' => 610, 'purchase_price' => 520, 'quantity' => 85, 'description' => 'Refined cooking oil'],
            ['name' => 'Mitchells Mixed Fruit Jam', 'barcode' => '101022', 'price' => 430, 'purchase_price' => 350, 'quantity' => 70, 'description' => 'Mixed fruit breakfast jam'],
            ['name' => 'National Ketchup 800g', 'barcode' => '101023', 'price' => 390, 'purchase_price' => 315, 'quantity' => 90, 'description' => 'Tomato ketchup family bottle'],
            ['name' => 'Surf Excel Bar', 'barcode' => '101024', 'price' => 95, 'purchase_price' => 70, 'quantity' => 160, 'description' => 'Laundry washing bar'],
            ['name' => 'Sufi Banaspati 1kg', 'barcode' => '101025', 'price' => 690, 'purchase_price' => 590, 'quantity' => 65, 'description' => 'Cooking banaspati pack'],
            ['name' => 'Harpic Toilet Cleaner 500ml', 'barcode' => '101026', 'price' => 330, 'purchase_price' => 260, 'quantity' => 100, 'description' => 'Powerful toilet cleaner'],
            ['name' => 'Rose Petal Tissue Box', 'barcode' => '101027', 'price' => 210, 'purchase_price' => 165, 'quantity' => 120, 'description' => 'Soft facial tissue box'],
            ['name' => 'Milo Chocolate Drink 500g', 'barcode' => '101028', 'price' => 760, 'purchase_price' => 625, 'quantity' => 8, 'description' => 'Chocolate malt energy drink'],
            ['name' => 'Surf Excel Matic 1kg', 'barcode' => '101029', 'price' => 720, 'purchase_price' => 600, 'quantity' => 8, 'description' => 'Automatic washing powder'],
            ['name' => 'Pampers Baby Dry Medium', 'barcode' => '101030', 'price' => 1650, 'purchase_price' => 1400, 'quantity' => 7, 'description' => 'Comfortable baby diapers pack'],
            ['name' => 'Rooh Afza Syrup 800ml', 'barcode' => '101031', 'price' => 410, 'purchase_price' => 330, 'quantity' => 70, 'description' => 'Traditional rose syrup'],
            ['name' => 'National Vermicelli 150g', 'barcode' => '101032', 'price' => 90, 'purchase_price' => 65, 'quantity' => 180, 'description' => 'Fine vermicelli noodles'],
            ['name' => 'Gourmet Mineral Water 1.5L', 'barcode' => '101033', 'price' => 80, 'purchase_price' => 55, 'quantity' => 240, 'description' => 'Mineral drinking water'],
            ['name' => 'Shan Chicken Handi Masala', 'barcode' => '101034', 'price' => 135, 'purchase_price' => 100, 'quantity' => 140, 'description' => 'Chicken handi spice mix'],
            ['name' => 'Surf Excel Washing Bar Twin', 'barcode' => '101035', 'price' => 180, 'purchase_price' => 135, 'quantity' => 110, 'description' => 'Twin pack laundry bars'],
            ['name' => 'Peek Freans Sooper Biscuits', 'barcode' => '101036', 'price' => 80, 'purchase_price' => 58, 'quantity' => 220, 'description' => 'Classic tea biscuits'],
            ['name' => 'Candi Biscuits Family Pack', 'barcode' => '101037', 'price' => 170, 'purchase_price' => 125, 'quantity' => 130, 'description' => 'Assorted family biscuits'],
            ['name' => 'Brite Liquid Blue 250ml', 'barcode' => '101038', 'price' => 120, 'purchase_price' => 90, 'quantity' => 100, 'description' => 'Laundry blue liquid'],
            ['name' => 'Olper Yogurt 450g', 'barcode' => '101039', 'price' => 190, 'purchase_price' => 150, 'quantity' => 95, 'description' => 'Creamy plain yogurt tub'],
            ['name' => 'Pakola Cream Soda 1.5L', 'barcode' => '101040', 'price' => 170, 'purchase_price' => 130, 'quantity' => 110, 'description' => 'Classic cream soda bottle'],
            ['name' => 'Sufi Laundry Soap', 'barcode' => '101041', 'price' => 90, 'purchase_price' => 65, 'quantity' => 150, 'description' => 'Everyday laundry soap'],
            ['name' => 'Surf Excel Dishwash 500ml', 'barcode' => '101042', 'price' => 260, 'purchase_price' => 205, 'quantity' => 75, 'description' => 'Lemon dishwashing liquid'],
            ['name' => 'Nido Fortigrow 900g', 'barcode' => '101043', 'price' => 2450, 'purchase_price' => 2100, 'quantity' => 35, 'description' => 'Fortified milk powder'],
            ['name' => 'National Chana Dal 500g', 'barcode' => '101044', 'price' => 230, 'purchase_price' => 185, 'quantity' => 90, 'description' => 'Premium split chickpeas'],
            ['name' => 'Guard Rice 5kg', 'barcode' => '101045', 'price' => 1150, 'purchase_price' => 980, 'quantity' => 55, 'description' => 'Long grain rice bag'],
            ['name' => 'Surf Excel Floor Cleaner 1L', 'barcode' => '101046', 'price' => 410, 'purchase_price' => 320, 'quantity' => 85, 'description' => 'Fresh floor cleaning solution'],
        ];

        foreach ($catalog as $data) {
            $purchasePrice = $data['purchase_price'];
            unset($data['purchase_price']);
            $product = Product::firstOrCreate(['barcode' => $data['barcode']], $data + ['status' => true]);
            if (blank($product->purchase_price)) {
                $product->purchase_price = $purchasePrice;
                $product->save();
            }
        }

        return Product::query()->where('status', true)->orderBy('id')->get();
    }

    private function seedServices(): \Illuminate\Support\Collection
    {
        $services = [
            ['name' => 'Home Delivery Service', 'barcode' => '200001', 'rate' => 200, 'description' => 'Express doorstep delivery'],
            ['name' => 'Gift Wrapping Service', 'barcode' => '200002', 'rate' => 100, 'description' => 'Decorative paper and ribbon wrapping'],
            ['name' => 'Product Installation', 'barcode' => '200003', 'rate' => 750, 'description' => 'In-home product installation support'],
            ['name' => 'Same Day Delivery', 'barcode' => '200004', 'rate' => 350, 'description' => 'Priority same-day delivery service'],
            ['name' => 'Bulk Order Handling', 'barcode' => '200005', 'rate' => 500, 'description' => 'Dedicated handling for bulk orders'],
            ['name' => 'Returns Pickup', 'barcode' => '200006', 'rate' => 250, 'description' => 'Scheduled returns collection'],
            ['name' => 'Corporate Packing', 'barcode' => '200007', 'rate' => 900, 'description' => 'Corporate order packing service'],
            ['name' => 'Warranty Registration', 'barcode' => '200008', 'rate' => 150, 'description' => 'Assisted warranty registration'],
            ['name' => 'Express Counter Service', 'barcode' => '200009', 'rate' => 75, 'description' => 'Priority checkout handling'],
            ['name' => 'Custom Label Printing', 'barcode' => '200010', 'rate' => 300, 'description' => 'Custom labels for customer orders'],
        ];

        foreach ($services as $data) {
            Service::updateOrCreate(['barcode' => $data['barcode']], $data + ['status' => true]);
        }

        return Service::query()->where('status', true)->orderBy('id')->get();
    }

    private function seedCustomers(User $admin): \Illuminate\Support\Collection
    {
        $names = [
            ['Muhammad', 'Ali', 'Karachi'], ['Usman', 'Tariq', 'Lahore'], ['Bilal', 'Ahmed', 'Islamabad'],
            ['Ayesha', 'Siddiqui', 'Lahore'], ['Hamza', 'Sheikh', 'Rawalpindi'], ['Fatima', 'Zahra', 'Karachi'],
            ['Zain', 'Abidin', 'Karachi'], ['Sara', 'Malik', 'Lahore'], ['Hassan', 'Raza', 'Multan'],
            ['Mariam', 'Khan', 'Faisalabad'], ['Owais', 'Qureshi', 'Peshawar'], ['Hira', 'Nawaz', 'Sialkot'],
            ['Danish', 'Iqbal', 'Hyderabad'], ['Sadia', 'Rauf', 'Quetta'], ['Fahad', 'Naseer', 'Karachi'],
            ['Nimra', 'Javed', 'Lahore'], ['Abdullah', 'Farooq', 'Islamabad'], ['Mehwish', 'Aslam', 'Gujranwala'],
            ['Saad', 'Hameed', 'Bahawalpur'], ['Maha', 'Rehman', 'Karachi'], ['Arslan', 'Butt', 'Lahore'],
            ['Iqra', 'Saeed', 'Islamabad'], ['Waqas', 'Younis', 'Multan'], ['Anum', 'Sohail', 'Karachi'],
            ['Shahzaib', 'Khalid', 'Peshawar'], ['Laiba', 'Imran', 'Lahore'], ['Noman', 'Asif', 'Karachi'],
            ['Eman', 'Shah', 'Islamabad'], ['Talha', 'Maqbool', 'Faisalabad'], ['Kiran', 'Rashid', 'Sialkot'],
            ['Yasir', 'Mehmood', 'Karachi'], ['Muneeba', 'Saleem', 'Lahore'], ['Adnan', 'Hussain', 'Rawalpindi'],
            ['Rida', 'Aziz', 'Karachi'], ['Sarmad', 'Khan', 'Islamabad'], ['Alina', 'Nadeem', 'Lahore'],
            ['Shahzaib', 'Akram', 'Multan'], ['Komal', 'Tariq', 'Karachi'], ['Faisal', 'Mansoor', 'Lahore'],
            ['Maham', 'Riaz', 'Islamabad'], ['Rizwan', 'Naeem', 'Karachi'], ['Saba', 'Waheed', 'Lahore'],
            ['Adeel', 'Mustafa', 'Peshawar'], ['Hina', 'Asghar', 'Karachi'], ['Junaid', 'Sattar', 'Lahore'],
            ['Sundas', 'Ilyas', 'Islamabad'], ['Umer', 'Kashif', 'Karachi'], ['Alishba', 'Feroz', 'Lahore'],
            ['Murtaza', 'Siddiq', 'Karachi'], ['Rabia', 'Munir', 'Rawalpindi'],
        ];

        foreach ($names as $index => [$firstName, $lastName, $city]) {
            $number = str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT);
            Customer::updateOrCreate(
                ['email' => "customer{$number}@salevince.test"],
                [
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => "customer{$number}@salevince.test",
                    'phone' => '03' . str_pad((string) (100000000 + $index), 9, '0', STR_PAD_LEFT),
                    'address' => "Demo Street, {$city}",
                    'user_id' => $admin->id,
                ]
            );
        }

        return Customer::query()->orderBy('id')->get();
    }

    private function seedSuppliers(): \Illuminate\Support\Collection
    {
        $suppliers = [
            ['Al Noor', 'Distributors', 'Karachi'], ['Metro', 'Wholesale', 'Lahore'], ['Pak Choice', 'Traders', 'Islamabad'],
            ['Fresh Mart', 'Suppliers', 'Rawalpindi'], ['City Cash', 'and Carry', 'Karachi'], ['National', 'Foods Supply', 'Lahore'],
            ['Prime Retail', 'Partners', 'Faisalabad'], ['Capital', 'Consumer Goods', 'Islamabad'], ['United', 'Wholesale', 'Multan'],
            ['Daily Needs', 'Distributors', 'Karachi'], ['Horizon', 'Trading Co', 'Lahore'], ['Smart Stock', 'Suppliers', 'Peshawar'],
        ];

        foreach ($suppliers as $index => [$firstName, $lastName, $city]) {
            $number = str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT);
            Supplier::updateOrCreate(
                ['email' => "supplier{$number}@salevince.test"],
                [
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => "supplier{$number}@salevince.test",
                    'phone' => '021-' . str_pad((string) (3000000 + $index), 7, '0', STR_PAD_LEFT),
                    'address' => "Industrial Area, {$city}",
                ]
            );
        }

        return Supplier::query()->orderBy('id')->get();
    }

    private function seedPurchases(User $inventoryUser, \Illuminate\Support\Collection $products, \Illuminate\Support\Collection $suppliers): void
    {
        for ($index = 1; $index <= 30; $index++) {
            $marker = 'DEMO PURCHASE #' . str_pad((string) $index, 3, '0', STR_PAD_LEFT);
            if (Purchase::where('notes', 'like', $marker . '%')->exists()) {
                continue;
            }

            $status = match ($index % 6) {
                0 => 'cancelled',
                1, 2 => 'pending',
                default => 'completed',
            };
            $supplier = $suppliers[($index - 1) % $suppliers->count()];
            $purchaseDate = Carbon::now()->subDays(($index * 9) % 240)->toDateString();
            $selectedProducts = collect();
            for ($line = 0; $line < 3 + ($index % 3); $line++) {
                $selectedProducts->push($products[($index * 2 + $line * 5) % $products->count()]);
            }

            $items = [];
            $total = 0.0;
            foreach ($selectedProducts as $line => $product) {
                $quantity = 8 + (($index + $line * 4) % 24);
                $purchasePrice = (float) ($product->purchase_price ?: ((float) $product->price * 0.75));
                $items[] = [$product, $quantity, $purchasePrice];
                $total += $quantity * $purchasePrice;
            }

            $purchase = Purchase::create([
                'supplier_id' => $supplier->id,
                'user_id' => $inventoryUser->id,
                'purchase_date' => $purchaseDate,
                'total_amount' => round($total, 2),
                'status' => $status,
                'notes' => $marker . ' — replenishment batch for demo testing.',
            ]);
            $purchase->created_at = Carbon::parse($purchaseDate)->setTime(9 + ($index % 8), ($index * 7) % 60);
            $purchase->updated_at = $purchase->created_at;
            $purchase->save();

            foreach ($items as [$product, $quantity, $purchasePrice]) {
                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'purchase_price' => $purchasePrice,
                ]);

                if ($status === 'completed') {
                    $product->quantity = (int) $product->quantity + $quantity;
                    $product->purchase_price = $purchasePrice;
                    $product->save();
                }
            }
        }
    }

    private function seedOrders(
        User $admin,
        User $manager,
        User $cashier,
        \Illuminate\Support\Collection $branches,
        \Illuminate\Support\Collection $counters,
        \Illuminate\Support\Collection $products,
        \Illuminate\Support\Collection $services,
        \Illuminate\Support\Collection $customers
    ): void {
        $users = [$admin, $manager, $cashier];
        $now = Carbon::now();

        for ($index = 1; $index <= 120; $index++) {
            $invoiceNo = 'POS-DEMO-' . str_pad((string) $index, 4, '0', STR_PAD_LEFT);
            if (Order::where('invoice_no', $invoiceNo)->exists()) {
                continue;
            }

            $daysAgo = $index <= 18 ? ($index % 15) : (($index * 11) % 365);
            $createdAt = $now->copy()->subDays($daysAgo)->setTime(9 + ($index % 11), ($index * 13) % 60);
            $branch = $branches[($index - 1) % $branches->count()];
            $branchCounters = $counters->where('branch_id', $branch->id)->values();
            $counter = $branchCounters[($index - 1) % $branchCounters->count()];
            $customer = $index % 9 === 0 ? null : $customers[($index * 3) % $customers->count()];
            $orderUser = $users[($index - 1) % count($users)];

            $lines = [];
            $subtotal = 0.0;
            $lineCount = 1 + ($index % 4);
            for ($line = 0; $line < $lineCount; $line++) {
                $product = $products[($index * 3 + $line * 7) % $products->count()];
                $quantity = 1 + (($index + $line) % 3);
                $unitPrice = (float) $product->price;
                $lineTotal = round($unitPrice * $quantity, 2);
                $lines[] = [0, $product->id, $product->name, $quantity, $lineTotal];
                $subtotal += $lineTotal;
            }

            if ($services->isNotEmpty() && $index % 4 === 0) {
                $service = $services[($index / 4 - 1) % $services->count()];
                $lineTotal = (float) $service->rate;
                $lines[] = [1, $products->first()->id, $service->name, 1, $lineTotal];
                $subtotal += $lineTotal;
            }

            $taxPercent = $index % 7 === 0 ? 0.0 : 8.0;
            $taxAmount = round($subtotal * $taxPercent / 100, 2);
            $discountPercent = $index % 6 === 0 ? 5.0 : 0.0;
            $discountAmount = round($subtotal * $discountPercent / 100, 2);
            $total = round(max(0, $subtotal + $taxAmount - $discountAmount), 2);

            $order = Order::create([
                'customer_id' => $customer?->id,
                'user_id' => $orderUser->id,
                'branch_id' => $branch->id,
                'counter_id' => $counter->id,
                'invoice_no' => $invoiceNo,
                'subtotal' => $subtotal,
                'tax_percent' => $taxPercent,
                'tax_amount' => $taxAmount,
                'discount_percent' => $discountPercent,
                'discount_amount' => $discountAmount,
                'total_amount' => $total,
            ]);
            $order->created_at = $createdAt;
            $order->updated_at = $createdAt;
            $order->save();

            foreach ($lines as [$itemType, $productId, $itemName, $quantity, $lineTotal]) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $productId,
                    'item_type' => $itemType,
                    'item_name' => $itemName,
                    'price' => $lineTotal,
                    'quantity' => $quantity,
                ]);
            }

            // Mix fully paid, partially paid, and unpaid orders for payment
            // status, invoice, and partial-payment UI testing.
            $received = match (true) {
                $index % 13 === 0 => 0.0,
                $index % 8 === 0 => round($total * 0.45, 2),
                default => $total,
            };
            Payment::create([
                'order_id' => $order->id,
                'user_id' => $orderUser->id,
                'amount' => $received,
            ]);
        }
    }

    private function seedReadyCarts(User $admin, \Illuminate\Support\Collection $products, \Illuminate\Support\Collection $services): void
    {
        $now = now();
        DB::table('user_cart')->where('user_id', $admin->id)->delete();
        foreach ($products->take(2) as $index => $product) {
            DB::table('user_cart')->insert([
                'user_id' => $admin->id,
                'item_id' => $product->id,
                'item_type' => 0,
                'quantity' => $index + 1,
            ]);
        }
        if ($services->isNotEmpty()) {
            DB::table('user_cart')->insert([
                'user_id' => $admin->id,
                'item_id' => $services->first()->id,
                'item_type' => 1,
                'quantity' => 1,
            ]);
        }

        DB::table('user_purchase_cart')->where('user_id', $admin->id)->delete();
        foreach ($products->skip(4)->take(3) as $index => $product) {
            DB::table('user_purchase_cart')->insert([
                'user_id' => $admin->id,
                'product_id' => $product->id,
                'quantity' => 5 + $index,
                'purchase_price' => $product->purchase_price ?: ((float) $product->price * 0.75),
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
}
